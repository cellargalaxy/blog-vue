---
createdAt: '2020-04-16'
updatedAt: '2020-04-16'
---
之前写过一篇分别用mysql，redis和zookeeper实现分布式锁，但写的比较简略。这次写个比较完整的redis锁和redis计数器的实现。

<!--more-->

# 场景与问题
有个定时任务，每到整点执行当前小时的任务。也就14点执行14点任务，15点执行15点任务，到了15点，哪怕14点任务还没执行也不用再执行了。原则，重复执行比不执行好。以前多节点执行任务也是使用了redis锁，逻辑是以小时为key，获取了锁的节点把key的超时时间设置为两个小时，避免其他节点能在拿到锁。但据说出现过问题，一两月下来突然有一两个任务执行失败了，至于什么问题由于历史久远已经无从查起。

# 现有的redis锁逻辑
```java
public class AutoPushRedisImpl {
    @Autowired
    private RedisTemplate redisTemplate;

    public boolean tryLock(String key, long time, TimeUnit timeUnit) {
        if (redisTemplate.opsForValue().setIfAbsent(key, "" + System.currentTimeMillis())) {
            redisTemplate.expire(key, time, timeUnit);
            return true;
        }
        return false;
    }

    public boolean unLock(String key) {
        redisTemplate.delete(key);
        return true;
    }
}
```
先从理论上说，这种实现会有两个问题。一是加锁的时间没有带上持锁人的信息，解锁的时候容易导致把别人的锁解了。二是如果setIfAbsent执行成功之后突然挂了，没能执行expire，那锁就永远都不会过期了。结合这个场景进行分析。第一点，锁是不用主动解的，实际上unLock方法就没被调用。设置了两小时过期时间，两小时之后就不会执行这个任务了，也不会有实例抢这个锁（当然前提是全部实例的时间都是对的）。而第二点，setIfAbsent执行成功后就报错了，锁永远不过时，其他节点无法执行这个任务，而这个节点又没执行这个任务，确实会导致描述里的问题。我本来觉得第二点虽然理论上可能会发生，但实际概率估计很小。不过现在想来服务器都在海外，网络波动应该是不可避免的才对。setIfAbsent的请求到redis，设置成功了，突然网络波动连接断开，setIfAbsent报错，也很合理。

# 改进思路
1. 自然是修复redis锁的逻辑bug
2. 增加一个任务执行失败后的有限重试机制

上面猜测setIfAbsent报错导致任务执行失败，但不止setIfAbsent的报错会导致任务执行失败。因此需要在任务由于任何原因执行失败之后，其他节点都能够重试这个任务。为了实现第二点，我的思路是，例如任务执行大约需要一分钟，那么节点获取锁之后给key设置十分钟的过期时间，足够执行任务。当任务执行完成，把key的过期时间设置为两小时，避免任务被重复执行。当任务执行抛异常被捕抓到，主动释放锁，或者当任务执行被强制中断，没能主动释放锁，但由于锁十分钟之后也会自动过期。所以没把key的过期时间修改两小时的任务都视为未能完成的任务，最后会因为锁的释放被重新执行。然后在redis记录任务执行的次数，当执行次数已经超过最大值，哪怕获取到锁也不再执行任务。这里由于是获取到锁才给执行次数加一，所以不要考虑并发问题。

# redis分布式锁
依赖，这里jedis的版本由spring-boot-starter-redis决定。
```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-redis</artifactId>
</dependency>
```

获取锁使用了Jedis的set方法，使得key不存在时才设置值以及给key设置过期时间是一个原子操作。在jedis新一点版本的set方法略有不同，NX和EX操作封装了个参数对象，大同小异。
```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import redis.clients.jedis.Jedis;

import java.util.Arrays;
import java.util.UUID;

@Slf4j
public class RedisLockImpl {
    /**
     * key不存在时才设置值
     */
    private static final String SET_IF_NOT_EXIST = "NX";

    /**
     * 过期时间单位标识，EX：秒
     */
    private static final String SET_WITH_EXPIRE_TIME = "EX";
    private static final String OK = "OK";
    private static final Long SUCCESS = 1L;
    private final RedisTemplate<String, String> redisTemplate;
    private final String instanceId;

    public RedisLockImpl(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.instanceId = UUID.randomUUID().toString();
    }

    public boolean tryLock(String key, int secondsToExpire) {
        if (secondsToExpire <= 0) {
            log.error("过期时间不得小于等于0");
            return false;
        }
        return redisTemplate.execute((RedisCallback<Boolean>) redisConnection -> {
            Jedis jedis = (Jedis) redisConnection.getNativeConnection();
            String result = jedis.set(key, instanceId, SET_IF_NOT_EXIST, SET_WITH_EXPIRE_TIME, secondsToExpire);
            boolean success = OK.equals(result);
            log.info("获取redis锁结果, key: {}, success: {}", key, success);
            return success;
        });
    }

    public boolean renewLock(String key, int secondsToExpire) {
        if (secondsToExpire <= 0) {
            log.error("过期时间不得小于等于0");
            return false;
        }
        return redisTemplate.execute((RedisCallback<Boolean>) redisConnection -> {
            Jedis jedis = (Jedis) redisConnection.getNativeConnection();
            String script = "if redis.call('get',KEYS[1]) ~= ARGV[1] then return 0 else return redis.call('expire',KEYS[1],ARGV[2]) end";
            Object result = jedis.eval(script, Arrays.asList(key), Arrays.asList(instanceId, String.valueOf(secondsToExpire)));
            boolean success = SUCCESS.equals(result);
            log.info("更新redis锁结果, key: {}, success: {}", key, success);
            return success;
        });
    }

    public boolean unLock(String key) {
        return redisTemplate.execute((RedisCallback<Boolean>) redisConnection -> {
            Jedis jedis = (Jedis) redisConnection.getNativeConnection();
            String script = "if redis.call('get',KEYS[1]) ~= ARGV[1] then return 1 else return redis.call('del',KEYS[1]) end";
            Object result = jedis.eval(script, Arrays.asList(key), Arrays.asList(instanceId));
            boolean success = SUCCESS.equals(result);
            log.info("释放redis锁结果, key: {}, success: {}", key, success);
            return success;
        });
    }
}
```

这里再掰一下释放锁的lua脚本的逻辑。在网上我看到的释放锁的lua脚本都是这样的逻辑：只有key存在并且为当前节点所有时，才会去执行释放锁，否则一律失败。但假若一种情况，一个节点获取到锁，过期时间一分钟，但任务执行了五分钟，这时候key已经过期，实际上锁已经被这个节点释放了，但当走释放锁的逻辑却是失败的，有用什么意义呢。如果之后会以释放锁来分支做一些逻辑，那是做还是不做呢，这个实例是确确实实获取过锁，才走到这里的。
```lua
//我的脚本
if redis.call('get', KEYS[1]) ~= ARGV[1] 
then 
    return 1 
else 
    return redis.call('del', KEYS[1]) 
end

//importnew的脚本
if redis.call('get', KEYS[1]) == ARGV[1] 
then 
    return redis.call('del', KEYS[1]) 
else 
    return 0 
end
```

# 分布式Redis锁
上面的redis锁是基于单个主节点的，如果主节点宕机进行了选举，新的主节点不一定能把锁的key同步，就可能会导致有两个实例获取到锁。

## Redlock
所以在redis集群里，有N个（例如5个）独立的主节点，可以使用Redlock（红锁）算法。

1. 获取当前时间戳作为开始时间戳
2. 依次向全部主节点加锁。每次加锁请求都需要设置超时时间，并且超时时间应该远远短于锁的有效时间
3. 如果获取到了过半数主节点的锁，并且当前时间减去开始时间戳小于锁有效时间，即锁还没过期，则获取锁成功。这样子锁的实际有效时间就是距离锁过期剩下的时间了
4. 如果没能获取过半锁，或者遍历完全部主节点后锁已经过期了，则向全部主节点解锁，稍等一段随机时间再重试

# Redlock的问题
1. 宕机问题：实例1拿到ABC三个锁，之后C宕机选举了，新C的锁丢了，实例2拿到了CDE三个锁，那就有两个实例拿到锁了
2. 停顿问题：实例1拿到了锁，之后经历了很长的GC，长到锁过期了，之后实例2拿到了锁，但实例1从GC醒来的时候还以为只有自己有锁
3. 时间问题：实例1拿到了ABC三个锁，C的时间出了问题导致锁提前过期，实例2拿到了CDE的锁

# redis计数器
redis计数器就很简单了，直接redisTemplate就能调用，返回的是加一之后的值。
```java
long increase = redisTemplate.opsForValue().increment(key, delta);
```

[SpringBoot Redis实现分布式锁](https://blog.csdn.net/Muscleheng/article/details/103052584)

[spring boot redis分布式锁](https://my.oschina.net/dengfuwei/blog/1600681)

[Redis分布式锁的正确实现方式（Java版）](https://cloud.tencent.com/developer/article/1353616)

[Redis分布式锁的正确实现姿势](https://benjaminwhx.com/2018/08/26/Redis%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81%E7%9A%84%E6%AD%A3%E7%A1%AE%E5%AE%9E%E7%8E%B0%E5%A7%BF%E5%8A%BF/)

[基于 Redis 的分布式锁](https://crossoverjie.top/2018/03/29/distributed-lock/distributed-lock-redis/)

[基于Redis实现分布式锁之前，这些坑你一定得知道](https://juejin.im/post/5e6727e16fb9a07cc845b9ba)

[Redlock算法](https://blog.wangqi.love/articles/distributed/Redlock%E7%AE%97%E6%B3%95.html)


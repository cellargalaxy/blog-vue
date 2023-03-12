---
createdAt: '2018-12-22'
updatedAt: '2018-12-22'
---

<!--more-->

# Mysql分布式锁
## Mysql的乐观锁
1. 互斥性：需要自己在表中增加一列值，为此锁的版本号。并利用Mysql事务的级别（读已提交）确保校验版本号，修改锁状态来实现
2. 解铃还须系铃人：需要自己在表中增加一列值，为唯一标志线程的id，以此标示锁的所有者
3. 不会发生死锁：需要自己在表中增加一列值，为此锁的过期时间
4. 具有容错性：暂时不会

使用InnoDB，假设表有三列：主键id、版本号version，用来标志当前锁的版本、锁状态status，例如0表示未锁，1表示已锁
```sql
//获取旧的状态与版本号
select status,version from table where id=1

//当旧的状态为0，就可以尝试获取锁了，把status设置为1
//但是要检查更新时的版本号依然是获取数据时的版本号
//如果仍然是旧的版本，说明在这段时间里没有线程获取了锁，修改成功并版本号+1。否则失败，非阻塞返回
update table set status=1,version=version+1 where version=#{version} and id=1
```

## Mysql的悲观锁
1. 互斥性：需在select语句后面加上`for update`，如果已经有其他线程`for update`同样的数据，select操作就会被阻塞
2. 解铃还须系铃人：需要自己在表中增加一列值，为唯一标志线程的id，以此标示锁的所有者
3. 不会发生死锁：如果加锁线程不释放锁是没有办法的。但是如果加锁线程挂了，连接断了，Mysql倒是会自动释放锁
4. 具有容错性：暂时不会

同样使用InnoDB，但select需要在事务内部。如果阻塞时间过长，jdbc一般会报异常而返回，实际上又不可以无限制等待下去，依然需要自己去实现重试。
```sql
#以免事务自动提交
set autocommit = 0;
begin;/begin work;/start transaction; (三者选一就可以)
//如果成功执行这句，就获取了锁了
select * from table where id = 1 for update;
//获取了锁之后就能进行业务操作了
update table set status=2 where id = 1;
//提交事务后释放锁
commit;
```

缺点：

1. 最大的问题是这里使用InnoDB一般是想利用InnoDB的行锁来提高并发，这就要求select语句的where需要走索引。但由于Mysql的内部优化，小表可能会全表扫描比走索引快，而实际使用的是表锁。行锁不一定靠谱，并发性能不稳定。
2. 数据库嘛，资源消耗大，性能一般般

# Redis分布式锁

1. 互斥性：利用redis操作的原子性来实现
2. 解铃还须系铃人：value的值为唯一标志线程的id，以此标示锁的所有者
3. 不会发生死锁：利用redis的过期功能实现。即使加锁线程没有释放锁，锁依然能够通过自动过期的方式释放掉
4. 具有容错性：下面只是一个单点redis的例子

```java
/**
 * @author cellargalaxy
 * @time 18-12-22
 */
@Service
public class RedisLock {
    //加锁操作成功返回的字符串
    private static final String LOCK_SUCCESS = "OK";
    //释放锁的Lua脚本，下面会解释这东西
    private static final String UN_LOCK_SCRIPT = "if redis.call('get', KEYS[1]) ~= ARGV[1] then return 1 else return redis.call('del', KEYS[1]) end";
    //加锁操作成功返回的long
    private static final Long RELEASE_SUCCESS = 1L;
    //每一个服务实例的每一个线程都有一个唯一的id
    private final ThreadLocal<String> id = new ThreadLocal<>();
    //当前线程是否已经获取了锁，默认为false
    private final ThreadLocal<Boolean> hasLock = ThreadLocal.withInitial(() -> false);
    private final JedisPool jedisPool;

    @Autowired
    public RedisLock(JedisPool jedisPool) {
        this.jedisPool = jedisPool;
    }

    public boolean tryLock(String lockKey, int expireTime) {
        if (id.get() == null) {
            //初始化线程id
            id.set(UUID.randomUUID().toString());
        }
        try (Jedis jedis = jedisPool.getResource()) {
            //SetParams是除了key-value，redis操作的其他参数
            //nx意思的SET IF NOT EXIST，即key不存在才操作
            //px是如果进行操作，这个key的过期时间
            SetParams setParams = new SetParams().nx().px(expireTime);
            //虽然这里检查了key是否存在，设置了value以及过期时间三个操作
            //但是这里调用了一次set方法，redis保证这三个操作的原子性
            String result = jedis.set(lockKey, id.get(), setParams);
            if (LOCK_SUCCESS.equals(result)) {
                hasLock.set(true);
                return true;
            }
            return false;
        }
    }

    public boolean unLock(String lockKey) {
        if (id.get() == null) {
            //初始化线程id
            id.set(UUID.randomUUID().toString());
        }
        try (Jedis jedis = jedisPool.getResource()) {
            //这里让redis执行Lua脚本，redis也保证Lua脚本的执行的原子性
            Object result = jedis.eval(UN_LOCK_SCRIPT, Collections.singletonList(lockKey), Collections.singletonList(id.get()));
            if (RELEASE_SUCCESS.equals(result)) {
                hasLock.set(false);
                return true;
            }
            return false;
        }
    }

    public final String getId() {
        if (id.get() == null) {
            //初始化线程id
            id.set(UUID.randomUUID().toString());
        }
        return id.get();
    }

    public boolean hasLock() {
        return hasLock.get();
    }
}
```
获取锁的解释在代码的注释里了，需要继续解释的是释放锁的那个脚本。`KEYS[1]`就是`lockKey`，`ARGV[1]`是`id.get()`。脚本意思显然是，如果加锁线程不是自己，则自己的锁就一定被释放了。否则返回删除key的结果。这是我参考[Redis 分布式锁的正确实现方式（ Java 版 ）](http://www.importnew.com/27477.html)改来的，他的脚本我觉得有问题。问题在于如果锁是因为过期而释放的，但对于调用这个方法的线程来说，锁确实是释放成功了，毕竟他已经不持有锁了。但是redis.call('get', KEYS[1]) == ARGV[1]却为false了，返回的是释放失败。
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

# Zookeeper分布式锁
使用Zookeeper实现分布式锁需要利用Zookeeper的三个特性：

1. 有序节点：如果创建一个`/lock/node-`的有序节点，Zookeeper会根据`/lock`下的子节点数量，给新创建的有序节点添加一个编号，实际生成的节点变成`/lock/node-0000000000`，下一个有序节点就是`/lock/node-0000000001`
2. 临时节点：会话结束或者客户端超时，Zookeeper会删除这个临时节点
3. 事件监听：我们可以对节点的四个事件进行监听，当事件发生时，Zookeeper会通知客户端。四个事件有：创建节点，删除节点，节点数据修改，子节点变更

Zookeeper分布式锁的流程如下：

1. 线程创建一个有序临时节点，并获取此节点的编号
2. 检查此节点编号是否最小，是的话则获取了锁
3. 如果编号不是最小，监听编号比自己小中最大的节点的删除事件
4. 监听到前节点的删除事件，从第二步开始重复，直到获得锁为止
5. 获得锁后执行业务
6. 删除节点，释放锁

分析：

1. Zookeeper保证有序节点之间不会重复，本质就是在排队。有点像Reentrantlock里面的阻塞队列，在排队，不断观察自己前面还有没有人，没有就到自己了。
2. 设置为临时节点，可以避免线程挂了，无法删除节点，这样后面的节点只能死等了
3. Zookeeper保证读操作与监听操作是原子的。避免有一种情况是线程A创建节点0并获取了锁，线程B创建节点1后发现有节点0，线程A删除节点0，线程B才去监听节点0被删除的情况。
4. 但是如果客户端存活却没有删除节点，后面的节点就只能死等，容易造成死锁。
5. 以及可以删除他人的节点？解铃不须系铃人？

参考文章：

[分布式锁看这篇就够了](http://www.54tianzhisheng.cn/2018/04/24/Distributed_lock/)

[mysql乐观锁总结和实践](https://chenzhou123520.iteye.com/blog/1863407)

[Redis 分布式锁的正确实现方式（ Java 版 ）](http://www.importnew.com/27477.html)

[SpringBoot 2.0 整合Jedis](https://blog.csdn.net/dingse/article/details/80572783)

[基于Zookeeper的分布式锁](http://www.dengshenyu.com/java/%E5%88%86%E5%B8%83%E5%BC%8F%E7%B3%BB%E7%BB%9F/2017/10/23/zookeeper-distributed-lock.html)

[ZooKeeper + Curator 实现分布式锁](https://www.jianshu.com/p/31335efec309)

[剖析curator的分布式互斥锁原理](http://blog.51cto.com/computerdragon/1764705) 
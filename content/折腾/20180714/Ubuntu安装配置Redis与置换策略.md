---
createdAt: '2018-07-14'
updatedAt: '2018-07-14'
---

<!--more-->

# 安装
安装依旧有两种办法，用apt-get安装和编译安装。用apt-get安装会自动配置为服务并开机自启，下面介绍的是编译安装。

首先到[官网](https://redis.io/ "官网")下载最新的稳定版，我下载的是[redis-4.0.10](http://download.redis.io/releases/redis-4.0.10.tar.gz "redis-4.0.10")。

```shell
#下载
wget http://download.redis.io/releases/redis-4.0.10.tar.gz
#解压
tar -zxvf redis-4.0.10.tar.gz
cd redis-4.0.10
#编译
make
#编译后测试，运行测试套件以确保built正确
make test
#安装
sudo make install
```

# 运行
完成后看看`/usr/local/bin/`文件夹下有没有redis的软件，试试执行redis的服务端命令`redis-server`和客户端`redis-cli`，应该会运行成功。也可以指定配置文件：`redis-server ./redis.conf`

# 配置
redis的配置文件模板在解压出来的redis-4.0.10文件夹下有，下面介绍常用参数
```
#指定内存大小的时候，必须要带上单位，单位不区分大小写
# 1k => 1000 bytes
# 1kb => 1024 bytes
# 1m => 1000000 bytes
# 1mb => 1024*1024 bytes
# 1g => 1000000000 bytes
# 1gb => 1024*1024*1024 bytes
################################ GENERAL常用  #####################################
#默认情况下 redis 不是作为守护进程运行的，如果你想让它在后台运行，你就把它改成 yes。
daemonize no
#监听端口号，默认为 6379，如果你设为 0 ，redis 将不在 socket 上监听任何客户端连接。
port 6379
#TCP 监听的最大容纳数量
tcp-backlog 511
#默认情况下，redis 在 server 上所有有效的网络接口上监听客户端连接。
#你如果只想让它在一个网络接口上监听，那你就绑定一个IP或者多个IP。
#示例，多个IP用空格隔开
# Examples:
# bind 192.168.1.100 10.0.0.1
#指定在一个 client 空闲多少秒之后关闭连接（0 就是不管它）
timeout 0
#tcp 心跳包。
# TCP keepalive.
#如果设置为非零，则在与客户端缺乏通讯的时候使用 SO_KEEPALIVE 发送 tcp acks 给客户端。
#推荐一个合理的值就是300秒
tcp-keepalive 300
#定义日志级别。
#可以是下面的这些值：
#debug 适用于开发或测试阶段
# verbose 基本不用的级别.许多很少有用的信息，但不是像调试级别混乱
# notice 适用于生产环境
# warning 仅仅一些重要的消息被记录
loglevel notice
#指定日志文件的位置
logfile ""
#设置数据库的数目。默认数据库是 DB 0，你可以在每个连接上使用 select <dbid> 命令选择一个不同的数据库，
#但是 dbid 必须是一个介于 0 到 databasees - 1 之间的值
databases 16
################################ SNAPSHOTTING快照   ################################
#存 DB 到磁盘：
#注意：你可以注释掉所有的 save 行来停用保存功能,也可以直接一个空字符串来实现停用
#下面的例子的意思是：
#900 秒内如果至少有 1 个 key 的值变化，则保存
#300 秒内如果至少有 10 个 key 的值变化，则保存
#60 秒内如果至少有 10000 个 key 的值变化，则保存
save 900 1
save 300 10
save 60 10000
#默认情况下，如果 redis 最后一次的后台保存失败，redis 将停止接受写操作，这样以一种强硬的方式让用户知道数据不能正确的持久化到磁盘，否则就会没人注意到灾难的发生。
stop-writes-on-bgsave-error yes
#是否在 dump .rdb 数据库的时候使用 LZF 压缩字符串
rdbcompression yes
#是否校验rdb文件
rdbchecksum yes
#设置 dump 的文件位置
dbfilename dump.rdb
#工作目录
#例如上面的 dbfilename 只指定了文件名，
#但是它会写入到这个目录下。这个配置项一定是个目录，而不能是文件名。
dir ./
################################# REPLICATION主从复制 #################################
#设置当本机为slav服务时，设置master服务的IP地址及端口，在Redis启动时，它会自动从master进行数据同步
# slaveof <masterip> <masterport>
#如果master设置了requirepass，那么slave要连上master，需要有master的密码才行。masterauth就是用来配置master的密码，这样可以在连上master后进行认证。
# masterauth <master-password>
#设置Redis连接密码，如果配置了连接密码，客户端在连接Redis时需要通过AUTH 命令提供密码，默认关闭
# requirepass foobared
################################### LIMITS 限制####################################
#设置能连上redis的最大客户端连接数量。默认是10000个客户端连接。由于redis不区分连接是客户端连接还是内部打开文件或者和slave连接等，所以maxclients最小建议设置到32。如果超过了maxclients，redis会给新的连接发送’max number of clients reached’，并关闭连接。
# maxclients 10000
#指定是否在每次更新操作后进行日志记录，Redis在默认情况下是异步的把数据写入磁盘，如果不开启，可能会在断电时导致一段时间内的数据丢失。因为 redis本身同步数据文件是按上面save条件来同步的，所以有的数据会在一段时间内只存在于内存中。默认为no
appendonly no
#指定更新日志文件名，默认为appendonly.aof
appendfilename "appendonly.aof"
#指定更新日志条件，共有3个可选值：
#no：表示等操作系统进行数据缓存同步到磁盘（快）
#always：表示每次更新操作后手动调用fsync()将数据写到磁盘（慢，安全）
#everysec：表示每秒同步一次（折衷，默认值）
############################## MEMORY MANAGEMENT ################################
#最大内存使用量
#maxmemory <bytes>
#数据丢弃策略
#maxmemory-policy noeviction
############################### ADVANCED CONFIG ###############################
#定期删除次数，即每秒进行多少次的定期删除
hz 10
```

# 过期策略
过期策略有三种：定时删除、定期删除、惰性删除

1. 定时删除是给每个key设置一个定时器，时间到了就删除此key。显然很耗cpu
2. 定期删除是redis每隔一段时间就随机抽取一些key检查是否过期，过期则删除。所以如果没有被随机到的过期key依然会保留着。
3. 惰性删除是当要获取某个key时，先检查此key是否已经过期，是的话就删除，返回null。这样的话，如果有大量key已经过期但迟迟没有被查询，就会一直保留着。

所以一般是使用定期删除搭配懒惰删除。定时删除和懒惰删除没查到在哪配置，定期删除可以在配置文件里配置`hz`参数。

# 内存限制与置换策略
内存限制和置换策略如上可以在配置文件里配置，也可以在客户端进行动态配置
```shell
#配置内存限制
> config get maxmemory
1) "maxmemory"
2) "0"
> config set maxmemory 100MB
OK
> config get maxmemory
1) "maxmemory"
2) "104857600"
#置换策略
> config set maxmemory-policy noeviction
```
置换策略有6种：

1. `noeviction`: 不进行置换，表示即使内存达到上限也不进行置换，所有能引起内存增加的命令都会返回error
2. `allkeys-lru`: 优先删除掉最近最不经常使用的key，用以保存新数据
3. `volatile-lru`: 只从设置失效（expire set）的key中选择最近最不经常使用的key进行删除，用以保存新数据
4. `allkeys-random`: 随机从all-keys中选择一些key进行删除，用以保存新数据
5. `volatile-random`: 只从设置失效（expire set）的key中，选择一些key进行删除，用以保存新数据
6. `volatile-ttl`: 只从设置失效（expire set）的key中，选出存活时间（TTL）最短的key进行删除，用以保存新数据

参考文献：

[如何在Ubuntu 16.04上安装并配置Redis](https://blog.csdn.net/zstack_org/article/details/69951845 "如何在Ubuntu 16.04上安装并配置Redis")

[Redis系列（一）--安装、helloworld以及读懂配置文件](https://blog.csdn.net/jack__frost/article/details/67633975 "Redis系列（一）--安装、helloworld以及读懂配置文件")

[如何用Redis做LRU-Cache](https://blog.csdn.net/cjfeii/article/details/47259519 "如何用Redis做LRU-Cache")

[Redis-key过期处理策略](https://www.ecpeng.com/2018/04/16/redis-key-expire-strategy/ "Redis-key过期处理策略")
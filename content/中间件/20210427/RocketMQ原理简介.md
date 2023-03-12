---
createdAt: '2021-04-27'
updatedAt: '2021-04-27'
---
RocketMQ是一个用java实现的队列模型消息中间件，由阿里开发，之后贡献给了Apache。

<!--more-->

# 主题模型
主题模型或者称为发布订阅模型。
一般由多个生产者组成一个生产组，多个消费者组成消费组。主题由多个队列组成，可以给同一主题下的消息添加标签，进行更细颗粒度的区分。
一个主题维护多个队列，以提高主题的并发能力。生产者可以给多个队列生产消息。

![](/file/blog/code/20210427/cdn.jsdelivr.net-gh-piterjia-piterjia.github.io-images-posts-rocketmq-rocketmq-3.jpg.JPEG)

# 架构模型
RocketMQ架构由四部分组成

+ Producer：生产者
+ Consumer：消费者
+ Broker：RocketMQ服务的实例
+ NameServer：用于Broker的服务发现

![](/file/blog/code/20210427/img2018.cnblogs.com-blog-1090617-201906-1090617-20190626173042073-147043337.jpg.JPEG)

![](/file/blog/code/20210427/cdn.jsdelivr.net-gh-piterjia-piterjia.github.io-images-posts-rocketmq-rocketmq-9.jpg.JPEG)

# NameServer与Broker

多个Broker会组成主从集群，从节点从主节点同步数据，如果主节点挂了，从节点提供消费功能，但不能进行写入。

多个NameServer组成去中心化集群，NameServer之间不会进行数据同步。
每个Broker会与所有NameServer维持一个长连接，每隔30s向所有NameServer发送心跳同步自身的主题等信息。
客户端会向NameServer查询Broker的路由信息。所以如果主节点挂了，客户端最多要30s才会发现。

# 生产者

生产者会轮训投递消息到每一个队列里。一般需要将队列均匀分布在不同的Broker里，均衡Broker的压力。

# 消费者
消费者支持pull和push的方式消费方式。而消费模式有两种：

+ 广播模式：每条消息都会被消费组里的全部消费者进行消费
+ 集群模式：每条消息都只由消费组里的一个消费者进行消费

在集群消费模式下，每个队列最多由一个消费者进行消费，而一个消费者可以消费多个队列。一般队列和消费者数量一致，如何消费者大于队列，就会有消费者空闲。
队列会维护每个消费组的offset，消息被一个消费组消费之后不会删除，待下一个消费组则进行消费。

# 顺序消费
RocketMQ的主题之间的消息是无序的，而RocketMQ支持的顺序消费有两种：

+ 普通顺序：同个主题的同个队列的消息是有序的，但是同个主题的不同队列直接的消息是无序的
  - 生产者需要线性投递有序消息
  - 如果Broker挂了，Broker所在的队列就不可用，此时同个hash投递的消息就可能会投递到其他队列里，导致乱序
+ 严格顺序：同个主题下的消息都是有序的
  - 如果有一台Broker挂了，则整个集群不可用 

# 回溯消费
RocketMQ支持对已经消费过的消息再次消费。RocketMQ支持按时间维度进行回溯，时间进度到毫秒。

# 刷盘机制
RocketMQ有两种刷盘机制：

+ 同步刷盘：每有消息写入都进行刷盘，等待刷盘成功才算消息写入成功，适用于与钱有关的场景
+ 异步刷盘：开一个线程去异步进行刷盘，减低IO延迟提高吞吐量，适用于对消息保证要求不高的场景，如发送验证码

# 主从同步
RocketMQ有两种集群模式和复制模式：

+ 普通集群：会给每个Broker一个固定的角色，主节点负责响应客户端请求并存储消息。从节点同步主节点的消息，并响应部分客户端的读请求。如果主节点挂了，集群就只读了。
+ Dledger高可用集群：使用Raft选举算法选出主节点。当写入消息时，要求消息至少复制到过半数节点，才给客户端返回成功。

+ 同步复制：消息双写到主从节点才返回成功
+ 异步复制：消息写入主节点就返回成功，之后再一步同步到从节点

# 存储机制
RocketMQ中有三种存储文件：

+ CommitLog：不区主题和分队列，全部数据会保存在一起。单文件大小默认1G，文件名为起始消息的offset
+ ConsumeQueue：消息消费队列，实际是CommitLog的索引。
  由于CommitLog包含全部主题的消息，但实际消费是以主题队列为维度的，所以要遍历CommitLog来查找消息效率很低。
  ConsumeQueue文件夹结构是`topic/queue/file`，概念上对应主题的一个队里。
  保存了指定主题下队列的消息在CommitLog中的偏移量(8字节)，消息大小(4字节)和消息tag的hash(8字节)。
  单个文件有30W个条目组成，文件大小约5.72M。
  通过消息的偏移量计算出索引在索引文件的文件，直接读取索引。再通过索引中的文件偏移量读取消息。
+ IndexFile：可以通过消息的Key或者时间区间查找消息

Kafka在同一个Broker上，会为不同主题各分配一个文件，但是RocketMQ却只分配一个文件。
主要是为了提高分批写入文件的概率，提高IO性能。但所带来的读取消息使用索引来解决。

参考文章

[RocketMQ 原理简介与入门](https://piterjia.github.io/2020/03/23/rocketmq-introduce/)

[RocketMQ 原理篇之基本概念](https://yunho.io/rocketmq/11.html)

[后端程序员必备：RocketMQ相关流程图/原理图](https://www.javazhiyin.com/44018.html)

[RocketMQ(1)-架构原理](https://www.cnblogs.com/qdhxhz/p/11094624.html)
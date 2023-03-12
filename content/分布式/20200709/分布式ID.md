---
createdAt: '2020-07-09'
updatedAt: '2020-07-09'
---

<!--more-->

# UUID
+ 本地生成速度快
+ 无序
+ 字符串，占用空间大

# 数据库自增ID
+ 有序递增
+ 插入数据时自动生成，方便
+ 性能较低
+ 分库分表：多主多从
  - 不同的自增步长
  - 号段模式：一次性拿一段号段，减少数据库操作频率
  - 扩容时先修改现有数据库的步长，之后新实例在一个较大的起始值开始自增

# Redis
+ 性能好，满足递增
+ 即便使用AOF，也有可能丢数据导致ID重复（如果是毫秒级的key来自增，redis重启恢复能到ms级？就算到ms级，缓个1ms不也行）

# 雪花算法
+ 第一个bit为0，标志正数
+ 毫秒时间戳占41bit，为当前时间减去一个过去时间，41bit可用69年
+ 机器ID占10bit，例如前五位机房编号，后五位机器编号
+ 序列号占12bit，支持同一毫秒同一节点生成4096个ID，满了需要自旋到下一毫秒

* 时间回拨
  - 检查本次ID时间与上次ID时间，如果回拨
  - 例如5ms以内则自旋一下
  - 否则需要预留一个拓展位改为1

参考文章：

[分布式id生成方案总结.md](https://github.com/Snailclimb/JavaGuide/blob/master/docs/system-design/micro-service/%E5%88%86%E5%B8%83%E5%BC%8Fid%E7%94%9F%E6%88%90%E6%96%B9%E6%A1%88%E6%80%BB%E7%BB%93.md)

[如果再有人问你分布式 ID，这篇文章丢给他.md](https://github.com/javagrowing/JGrowing/blob/master/%E5%88%86%E5%B8%83%E5%BC%8F/%E5%A6%82%E6%9E%9C%E5%86%8D%E6%9C%89%E4%BA%BA%E9%97%AE%E4%BD%A0%E5%88%86%E5%B8%83%E5%BC%8F%20ID%EF%BC%8C%E8%BF%99%E7%AF%87%E6%96%87%E7%AB%A0%E4%B8%A2%E7%BB%99%E4%BB%96.md)
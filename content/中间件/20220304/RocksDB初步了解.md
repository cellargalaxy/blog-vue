---
createdAt: '2022-03-04'
updatedAt: '2022-03-07'
---

RocksDB是一个嵌入式的KV数据库，由Facebook基于levelDB开发。
多数情况下，看一把RocksDB看做是一个在本地的，数据落盘的，大数据量的Redis，且访问性能高于远端的Redis。
RocksDB底层使用LSM树实现，但LSM树实际上并不是一棵具体的树，其实是一套存储处理算法。
LSM树对KV的持久化，保持较高性能的读的基础上，实现了追加写，提供了写入的性能。

<!--more-->

# LSM树的实现

RocksDB的LSM树的存储结构有三种：WAL+mentable+SSTable

## WAL

WAL(write-ahead log)(预写式日志)，WAL本质是一个追加写入的硬盘文件，是数据库技术中实现事务的一种标准方法，可以实现单机事务的原子性和持久性，同时提高写入的性能。
在修改数据时为了实现事务的原子性和持久性，并不会直接修改数据文件，因为一个事务中可能会随机修改多个字段，导致需要修改数据文件的位置也是随机的。
一是随机IO会影响性能，二是多次的随机IO写入显然无法保证原子性。
而使用WAL的话，并不会直接去修改数据文件，而是把数据修改的情况都写入WAL里。往WAL里写入的类型有两种，redo执行写操作，undo回滚写操作。
接下来可能会有五种情况：

+ 往WAL写入redo前崩溃了，重启后WAL并没有相关日志：事务无执行，数据文件无影响
+ 往WAL写入redo时崩溃了，重启后WAL的日志并不完整：事务取消执行，数据文件无影响
+ 往WAL写入redo后崩溃了，重启后WAL的日志写入完整：从WAL中读出所需修改的数据，修改数据文件
+ 修改数据文件时崩溃了：从WAL中读出所需修改的数据，继续修改数据文件
+ 修改数据文件无法进行：往WAL里写入undo，回滚写操作，事务执行失败

使用WAL支持并发读读和读写，由于都是追加写入，不支持并发写写。
如果需要读最新的数据，则需要往WAL里查询。如果WAL没查到，那数据文件里的就是最新的数据。
需要注意，写入WAL与修改数据文件并不一定是同步的。往往会合并WAL多个写操作，批量刷入硬盘里。

## mentable

mentable是RocksDB的内存数据结构，使用跳表实现，分为active memtable和immutable memtable两种。
RocksDB在写入WAL之后，会把数据写到active mentable里。
如果active mentable被写满，会新建一个active mentable，旧的会变成immutable memtable，等待被异步刷入硬盘里。

## SSTable

SSTable，SST文件，全称Sorted String Table，是持久化的，不可改的，有序的数据文件。
SSTable的文件分为多个区域，内部有索引信息能加快数据查询速度。
mentable被刷到硬盘里的数据去向就是生成SSTable。
SST文件都属于某一个层，从L0到Ln，层级越小，数据越新。新生成的SST文件首先会在L0层，但每一层的SST文件数量会有限制。在一定的条件下，会对SST文件进行合并。

### Compaction

由于RocksDB通过增量写写入mentable，而SST文件数据来源于mentable，所以SST文件的数据的冗余的。
为了减少冗余，会对SST文件进行合并，删除重复或者过期的key。
而RocksDB默认是使用Level Style Compaction作为合并策略。

首先L0的SST文件是从mentable生成的，所以L0的SST文件直接会有重复的key。
当进行合并时，会选择Ln层的一个文件，与Ln+1的多个文件进行合并，合并相同的key，删除失效key。
合并后，每一层的SST文件直接都是有顺序的。

## 读操作

1. 在active mentable里查询
2. 在immutable memtable里查询
3. 在L0里查询。由于L0可能有重复key，所以才有遍历查询
4. 在Ln里查询，由于Ln没有重复key，所以使用二分法查询
5. 如果到Lmax都还查不到，那就是查不到

## 写操作

1. 数据写入active mentable
2. active mentable到达一定大小，会转变成immutable memtable，创建新的active mentable继续提供读写
3. 满足一定会把immutable memtable刷为硬盘的SST文件。先写入系统缓存页，再异步写入硬盘，考虑到系统奔溃丢缓存页可能性较低，异步写还是可靠的

## Column Family
kv存储时需要指定列族(Column Family)，且允许创建多个列族。列族直接使用不同的mentable和SST文件，但是公用一个WAL。
好处是可以对不同列族的mentable和SST进行不同的配置，提高读写性能。

# LSM树总结

相比于B+树来说，要在B+树写入随机的数据，写入的节点位置是随机的，随机写入影响着B+树的写入性能。
而LSM树通过使用WAL，mentable和SST文件，将随机写转换为顺序写，大大提高了写入的性能。
但顺序写的所带来的代价的空间放大，写放大和读放大。

+ 由于SST文件的冗余性，存储空间被放大
+ 同样由于冗余性而需要进行合并，每次合并都进行一次写操作，实际是把每次只需写入一次的数据放大操作了多次写
+ LSM树读取数据需要分层读取多次，读取次数的放大会影响读性能

空间放大，写放大和读放大三种需要平衡，RocksDB提供了许多配置来进行微调设置。
跟B+树相比，B+树对事物支持更好，因为B+树能原地更新数据，并且数据只有一份。而LSM树的key在L0里会重复，只有在进行合并的时候才算完成事物。
LSM树支持O(1)的写，O(n)的读。而B+树的读写都是O(logN)。通常来说，LSM树的写性能由于B+树，B+树的读性能优于LSM树。

参考文章

[从 RocksDB 看 LSM-Tree 算法设计](https://segmentfault.com/a/1190000041198407)

[一个项目的诞生(三)：RocksDB的价值](https://flynx.dev/rocksdb/)

[WAL(预写式日志)简介](https://lessisbetter.site/2020/01/02/wal-introduction/)

[你常听说的WAL到底是什么](https://cloud.tencent.com/developer/article/1623123)
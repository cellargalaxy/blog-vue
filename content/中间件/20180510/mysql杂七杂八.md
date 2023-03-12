---
createdAt: '2018-05-10'
updatedAt: '2018-05-10'
---

<!--more-->

# 外键的优缺点
从数据库层面上保证数据的一致性。第一，程序可能会有各种各样的bug，很难保证数据的一致性。第二，如果不同项目之间使用到同一个数据库，那么这些项目之间的数据一致性交给数据库来保证会比较好。但是，既然数据库要检查数据的一致性，那么就要花费额外的花销（还不小），降低数据库的性能。并且没有外键的各种牵扯，数据库的管理也会比较简单。因此，大型系统，要求高的数据一致性，对速度要求不高的，外键为好。而要求性能高的，数据一致性程序来保证，不用外键，写一层来检验数据一致性。

# mysql的锁与引擎
关于mysql的锁我刚接触，没多少了解。但是想一想，mysql当然也是需要锁来确保并发操作时的正确性的。锁有三类：

1. 行级锁：行级锁是Mysql中颗粒度最小的锁。只对操作的行进行加锁。只要不是并发操作同一行，那么就不会发送冲突。因此行锁并发程度高。但是每行有锁，加锁的成本就大。会出现死锁。行级锁分为共享锁和排他锁。
2. 表级锁：表级锁是mysq中颗粒度最大的锁。顾名思义就是对整个表加锁，因此冲突高，并发低。但是实现简单，加锁成本小。不会出现死锁。也为共享锁和排他锁。
3. 页级锁：页级锁是介于行级锁和表级锁之间的锁。会出现死锁，性能介于行级锁和表级锁之间。

## 引擎的锁
1. BDB采用页面锁
2. MyISAM和MEMORY采用的都是表级锁
3. InnoDB既支持行级锁也支持表级锁，默认优先尝试使用行级锁。

## InnoDB的锁
InnoDB默认优先尝试使用行级锁。与Oracle是对相应数据行加锁来实现的不同，mysql的是通过给索引上的索引项加锁来实现的。也就是说，只有操作用到索引（主键索引，唯一索引，普通索引），才使用行级锁，否则使用表级锁。而InnoDB的死锁是由于他的锁的分部获取的缘故导致的。如果操作一用到了主键索引，那么直接锁定主键索引（再锁定其非主键索引？）。如果操作二使用了非主键索引，那么先锁定非主键索引，再锁定其主键索引。就会导致两个操作互相等待死锁。InnoDB会检查出这种死锁，使一个事务释放锁回退，另一个获取锁完成事务。

# 事务的四种隔离级别
盗个表

|隔离级别|脏读|不可重复读|幻读|
|-------|----|---------|----|
|未提交读|可能|可能|可能|
|已提交读|不可能|可能|可能|
|可重复读|不可能|不可能|可能|
|可串行化|不可能|不可能|不可能|

# 范式
1. 第一范式：每个属性都不可再分，即不可以有表中表
2. 第二范式：消除非主属性对于码的部分函数依赖
3. 第三范式：消除非主属性对于码的传递函数依赖
4. BCNF范式：消除 主属性对于码的部分与传递函数依赖


1. 完全函数依赖：X是一到多个属性，x的整体决定Y
2. 部分函数依赖：X是一到多个属性，x的部分决定Y
3. 传递函数依赖：∵X→Y；Y→Z，∴X→Z
4. 候选码(码)：K为一多多个属性，其他属性**完全函数依赖**于K
5. 主属性：候选码的属性

# mysql的explain使用
我的mysql版本是`mysql  Ver 14.14 Distrib 5.7.22, for Linux (x86_64) using  EditLine wrapper`。explain可以展示select语句执行的情况，特别是对慢查询的优化。详细的文档可以看官网的：[EXPLAIN Output Format](https://dev.mysql.com/doc/refman/5.5/en/explain-output.html "EXPLAIN Output Format")。我的版本的explain有几个字段：id，select_type，table，partition，type，possible_keys，key，key_len，ref，rows，filtered，Extra。

`id`：有些说没啥用，有些说是sql执行的顺序的标识,从大到小的执行，相同时，执行顺序由上至下。

`select_type`：有例如一下几个值：
* `simple`：表示简单的select,没有union和子查询
* `primary`：表示有子查询的语句中，最外面的那个查询
* `union：union`：语句的第二个或者后面的那些查询
* `dependent union`：union语句的第二个或者后面的那些查询，取决于外面的查询（不知道啥意思）
* `union result`：union的结果（也不懂）

`table`：select的表

`partitions`：官网说是“匹配的分区”（The matching partitions）（不知道啥意思）

`type`：连接使用的类型，即mysql查找到所需的行所用的方法（显然重要）。效果从差到好：all, index,  range, ref, eq_ref, const, system, null
* `all`：一行一行全表扫描，可想而知效果很差，需要通过索引（没有就创建）来优化
* `index`：通过索引树来全表扫描。会比all快一点点
* `range`：只检索指定范围(<,>,between)的行，并用一个索引选择行
* `ref`：表示上述表的连接匹配条件，即哪些列或常量被用于查找索引列上的值（所以就是用到索引的意思？）
* `eq_ref`：在ref基础上，所使用到的索引是唯一索引（unique key和primary key）
* `const`：常出现与比较primary key时？
* `system`：const的特例，当表只有一行数据时
* `null`：执行时不用访问表或索引

`possible_keys`：可以被使用到的索引，但不一定会用到

`key`：实际使用到的索引

`key_len`：索引的长度（不知道啥意思），在不影响精度(?)的前提下，越短越好

`ref`：索引的哪一列被使用了（但是实际显示的却不是列名）

`rows`：预测需要遍历查找的行数，越大越不好

`filtered`：官网说是“按表条件过滤的行的百分比”(Percentage of rows filtered by table condition)

`Extra`：其他说明

```sql
create table user (
    id int primary key,
    name varchar(30),
    age int,
    index (age) 
) ENGINE=InnoDB;

insert into user values (1, 'name1', 11), (2, 'name2', 22), (3, 'name3', 33);
```

参考文献：

[数据库外键的使用以及优缺点](http://www.cnblogs.com/tearer/archive/2010/07/25/1784896.html "数据库外键的使用以及优缺点")

[解释一下关系数据库的第一第二第三范式？](https://www.zhihu.com/question/24696366 "解释一下关系数据库的第一第二第三范式？")

[MySQL数据库锁机制之MyISAM引擎表锁和InnoDB行锁详解](https://blog.csdn.net/hsd2012/article/details/51112009 "MySQL数据库锁机制之MyISAM引擎表锁和InnoDB行锁详解")

[MySQL中的行级锁,表级锁,页级锁](http://www.hollischuang.com/archives/914 "MySQL中的行级锁,表级锁,页级锁")

[Innodb中的事务隔离级别和锁的关系](https://tech.meituan.com/innodb-lock.html "Innodb中的事务隔离级别和锁的关系")

[mysql explain的使用（优化查询）](http://www.cnblogs.com/0201zcr/p/5742382.html "mysql explain的使用（优化查询）")

[MySQL Explain详解](http://www.cnblogs.com/xuanzhi201111/p/4175635.html "MySQL Explain详解")

[使用explain和show profile来分析SQL语句实现优化SQL语句](http://www.shixinke.com/mysql/mysql-sql-optimization-with-using-explain-and-show-profile "使用explain和show profile来分析SQL语句实现优化SQL语句")
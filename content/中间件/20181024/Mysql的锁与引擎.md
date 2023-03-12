---
createdAt: '2018-10-24'
updatedAt: '2018-10-24'
---

<!--more-->

# 乐观锁

先不获取锁，认为写的时候一般数据不会被写的事务修改，但要提交数据的时候才检查数据是否被修改了。用于读多写少的情景。而检查数据是否被修改的方法一般是给数据添加版本号或者是时间戳。乐观锁数据库没有实现，需要我们自己实现。例如：
```sql
select id,version from table where id = #{id}
update table set value=2,version=version+1 where id=#{id} and version=#{version}
```

# 悲观锁
认为别的事务很有可能会修改数据，因此自己修改数据时先获取锁，获取不到锁就等待。用于写多读少的情景。其中有两个分类：共享锁（读锁）和独占锁（写锁）。共享锁下只能加共享锁而不能加独占锁，独占锁下共享锁和独占锁都不能加。数据库已经实现了悲观锁。

## 共享锁
共享锁的用法是在sql后面加上`lock in share mode`获取锁。获取锁失败将会被阻塞。使用commit提交事务后才释放锁。
```sql
begin;/begin work;/start transaction;  (三者选一就可以)
SELECT * from table where id = 1 lock in share mode;
commit;
```

## 独占锁
独占锁的用法是在sql后面加上`for update`获取锁。获取锁失败将会被阻塞。使用commit提交事务后才释放锁。
```sql
#以免事务自动提交
set autocommit = 0;
begin;/begin work;/start transaction; (三者选一就可以)
select * from table where id = 1 for update;
update table set value = 2 where id = 1;
commit;
```

# InnoDB的行锁
当where有主键索引或者唯一索引，并且实际上mysql查询时候走了索引，InnoDB优先使用行锁。如果where的是普通索引，mysql会判断此索引的值区分度高低，高的走索引，使用行锁，否则都使用表锁。对于inser、delete和update，InnoDB会自动加排它锁，而select不加锁。但是，如果要操作表中大部分甚至全部数据，反而建议用表锁。
优势：并发能力高
劣势：开销大，加锁慢，容易出现死锁

# InnoDB的间隙锁
当where使用的是范围条件，在查询范围内但实际不存在的记录也会加锁，称为间隙锁。例如where id>100，实际[...100,101,102]。大于103的数据虽然不存在，但仍会加锁，以避免幻读。

# InnoDB的死锁
InnoDB里有表锁或者行锁，那么就可能两个不同事务先获取了锁1锁2，然后他们又先获取锁2锁1，就死锁了。
![](/file/blog/code/20181024/img2.tbcdn.cn-L1-461-1-da89a5774d02b974b63bf08bf47f146c94e75909.png.1.png)
![](/file/blog/code/20181024/img1.tbcdn.cn-L1-461-1-e470063b82bb3d005f6935cb51ec656c2c1a3d1e.png.1.png)

死锁解决办法
```sql
# 查看当前的事务
SELECT * FROM INFORMATION_SCHEMA.INNODB_TRX;
# 查看当前锁定的事务
SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCKS;
# 查看当前等锁的事务
SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCK_WAITS;
# 杀死进程
kill 进程ID
```

减少死锁的办法：
1. 按统一顺序访问表或者行
2. 尽量使用小事务
3. 事务中尽可能一次锁定全部所需资源
4. 降低隔离级别

# MyISAM的读写锁
MyISAM不支持事务。MyISAM默认给insert、delete和update加写锁，给select加读锁。
```sql
# 锁定表
LOCK TABLES tbl_name {READ | WRITE},[ tbl_name {READ | WRITE},…]
# 解锁表
UNLOCK TABLES
```

因此MyISAM的读写是串行的。但也可以通过配置concurrent_insert字段设置。
concurrent_insert=0：不允许并发插入
concurrent_insert=1：如果表中没有空洞（即表中没有被删除的行），允许边读，边在表尾插入，默认。
concurrent_insert=2：无论有没有空洞，都允许在表尾插入。

而当读和写两个事务同时想获取锁，写事务优先。也可通过配置修改。

# MyISAM和InnoDB的比较
+ MyISAM不支持事务，不支持外键，访问速度快。
+ 物理储存会把表分为三个文件：表定义、数据和索引。由于索引是单独一个文件，直接保存数据文件的地址，索引查找速度会更快。而InnoDB的所有表都保存在同一个文件里。
+ MyISAM的储存格式也有三个：静态表、动态表和压缩表。静态表适用于字段都是固定长度，而有text或者blob的会使用动态表。压缩表能减少磁盘占用。
+ MyISAM只支持表锁，InnoDB支持行锁和表锁
+ MyISAM支持全文索引，InnoDB不支持
+ MyISAM允许没有任何索引主键，InnoDB没有也会偷偷创建一个不可见的主键


参考文献：

[全面了解mysql锁机制（InnoDB）与问题排查](https://juejin.im/post/5b82e0196fb9a019f47d1823)

[MySQL 乐观锁与悲观锁](https://www.jianshu.com/p/f5ff017db62a)

[mysql死锁问题分析](https://www.cnblogs.com/LBSer/p/5183300.html)

[mysql存储引擎之MyISAM 和 InnoDB的比较](https://www.cnblogs.com/xiaoxi/p/7404870.html)

[MySQL存储引擎－－MyISAM与InnoDB区别](https://www.jianshu.com/p/a957b18ba40d)
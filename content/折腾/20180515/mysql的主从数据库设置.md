---
createdAt: '2018-05-15'
updatedAt: '2018-05-15'
---
尝试了一下mysql主从数据库的同步，想不到还蛮简单的。网上说mysql做主从同步要数据库版本一样啊，系统都要一样啊等等一堆条件，但是我发现我本地ubuntu的从数据库mysql和vps的centos上面的主数据库mariadb都能成功同步。当然，如果是在生产环境下，这样子可以避免不必要的麻烦。还有主从数据库的数据一开始还是要一致的。

<!--more-->

# mysql主从数据库同步原理
1. 主数据库会开启配置后会输出一个二进制日志文件(binary log)。这个二进制日志文件会记录这主数据库的全部sql操作
2. 从数据库通过I/O读取主数据库的这个二进制日志文件，并写到自己的中继日志(relay log)里
3. 从数据库根据中继日志，重做主数据库做过的操作，以达到从数据库的数据与主数据库同步

# 准备工作
现在主数据库里创建个数据库和表
```sql
create database learn；

create table user (
    id int primary key,
    name varchar(30),
    age int,
    index (age)
) ENGINE=InnoDB;
```

# 主数据库搭建
首先配置主数据库，主数据库是mariadb。配置完成之后重启数据库。
```
[mysqld]
#一般设置为IP，唯一
server_id=100

#需要同步的数据库，如果是多个，就以此格式在写一行即可
binlog-do-db=learn

#不需要同步的数据库，如果是多个，就以此格式在写一行即可
binlog-ignore-db=mysql

#开启二进制日志功能，最好有含义
log-bin=log-bin

#为每个session 分配的内存，在事务过程中用来存储二进制日志的缓存
binlog_cache_size=1M

#主从复制的格式（mixed,statement,row，默认格式是statement）
binlog_format=mixed

#二进制日志自动删除/过期的天数。默认值为0，表示不自动删除
expire_logs_days=7

#跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062

#每个bin-log最大大小，当此大小等于500M时会自动生成一个新的日志文件。一条记录不会写在2个日志文件中，所以有时日志文件会超过此大小。
max_binlog_size=500M

#当Slave从Master数据库读取日志时更新新写入日志中，如果只启动log-bin 而没有启动log-slave-updates则Slave只记录针对自己数据库操作的更新。
log-slave-updates
```
检查，要记住File和Position，从数据库要用到。也可以看到Binlog_Do_DB是learn数据库，Binlog_Ignore_DB是mysql数据库
```
MariaDB [(none)]> show master status;
+----------------+----------+--------------+------------------+
| File           | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+----------------+----------+--------------+------------------+
| log-bin.000001 |      245 | learn        | mysql            |
+----------------+----------+--------------+------------------+
1 row in set (0.00 sec)
```
创建一个账号，授权给从数据库使用
```
MariaDB [(none)]> grant replication slave on *.* to 'slave'@'%' identified by '111111';
Query OK, 0 rows affected (0.00 sec)

MariaDB [(none)]> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

# 从数据库搭建
同样，先配置。配置完成之后重启数据库。
```
[mysqld]
#一般设置为IP，唯一
server_id=101

#需要同步的数据库，如果是多个，就以此格式在写一行即可
binlog-do-db=learn

#不需要同步的数据库，如果是多个，就以此格式在写一行即可
binlog-ignore-db=mysql

#开启二进制日志功能，最好有含义，以备Slave作为其它Slave的Master时使用
log-bin=log-bin

## 为每个session 分配的内存，在事务过程中用来存储二进制日志的缓存
binlog_cache_size=1M

#主从复制的格式（mixed,statement,row，默认格式是statement）
binlog_format=mixed

#二进制日志自动删除/过期的天数。默认值为0，表示不自动删除。
expire_logs_days=7

#跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断。如：1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062

#relay_log配置中继日志
relay_log=relay_log

## log_slave_updates表示slave将复制事件写进自己的二进制日志
log_slave_updates=1

## 防止改变数据(除了特殊的线程)
read_only=1
```

重启完成之后，设置这个从数据库跟从哪个主数据库，这里就用到了主数据库记下来的File（master_log_file）和Position（master_log_po）。
```sql
mysql> change master to master_host='192.168.1.1', master_user='slave', master_password='111111', master_port=3306, master_log_file='log-bin.000001', master_log_pos=245, master_connect_retry=30;

#启动从数据库模式
mysql> start slave;
Query OK, 0 rows affected (0.00 sec)

#检查从状态，Slave_IO_Running和Slave_SQL_Running两个都是yes才是正常
mysql> show slave status\G;
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.1.1
                  Master_User: slave
                  Master_Port: 3306
                Connect_Retry: 30
              Master_Log_File: log-bin.000001
          Read_Master_Log_Pos: 1135
               Relay_Log_File: relay_log.000002
                Relay_Log_Pos: 432
        Relay_Master_Log_File: log-bin.000001
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
。。。
```

# 测试
```sql
#往主数据库插入数据
MariaDB [learn]> select * from user;
Empty set (0.00 sec)

MariaDB [learn]> insert into user values (1, 'name1', 11), (2, 'name2', 22), (3, 'name3', 33);
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

MariaDB [learn]> select * from user;
+----+-------+------+
| id | name  | age  |
+----+-------+------+
|  1 | name1 |   11 |
|  2 | name2 |   22 |
|  3 | name3 |   33 |
+----+-------+------+
3 rows in set (0.00 sec)

#一开始从数据库
mysql> select * from user;
Empty set (0.00 sec)

#之后从数据库
mysql> select * from user;
+----+-------+------+
| id | name  | age  |
+----+-------+------+
|  1 | name1 |   11 |
|  2 | name2 |   22 |
|  3 | name3 |   33 |
+----+-------+------+
3 rows in set (0.00 sec)
```

参考文章：

[MySQL主从复制搭建，基于日志（binlog）](http://raye.wang/2017/04/14/mysqlzhu-cong-fu-zhi-da-jian-ji-yu-ri-zhi-binlog/ "MySQL主从复制搭建，基于日志（binlog）")

[MySQL数据库设置主从同步](https://blog.csdn.net/u013372487/article/details/51658692 "MySQL数据库设置主从同步")

[MySQL主从复制原理、半同步操作步骤及原理](https://blog.csdn.net/abcdocker/article/details/71249760 "MySQL主从复制原理、半同步操作步骤及原理")
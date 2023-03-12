# OLTP

Online Transactional Processing，事务型数据库。

要求实时处理，响应速度快，保证事务的ACID。实际场景中，多会操作少数几行的多列数据，因此适用于行式存储。

# OLAP

Online analytical processing：分析型数据库。

对查询速度要求不高，查询也并不频繁，操作多是查询，对修改需求不高。实际场景中，多会查询少数几列的多行数据，因此适用于列式存储。

# HTAP

Hybrid Transactional/Analytical Processing：混合型数据库。

既能支持实时事务特性，也支持大量数据查询分析的性能，一般由三种实现方式。

1. 在应用层对OLTP和OLAP系统进行松耦合，OLTP和OLAP共享一份数据，通过ETL将OLTP的数据同步到OLAP，整体对外表现为HTAP。
2. 在数据库层分别使用行存储引擎和列存储引擎，分别负责OLTP和OLAP的功能。存储在物理上隔离，使用一定的协议进行数据同步。是主流的实现方案。
3. 使用但一次存储引擎，同时实现OLTP和OLAP。但无论是单使用行存储还是列存储，性能都无法达到较优。


参考文献

+ https://cloud.tencent.com/developer/article/1706006

+ https://blog.51cto.com/kymdidicom/3145671

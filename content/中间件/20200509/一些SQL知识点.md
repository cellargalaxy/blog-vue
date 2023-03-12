---
createdAt: '2020-05-09'
updatedAt: '2020-05-09'
---

<!--more-->

# 数据
```
person 表
pid  age name
1     11     小明
2     22     小红
3     33     小白

address 表
aid pid city
10    1    北京
11    1    东京
12    2    南京
13    4    西京
```

# 内连接
只有两张表都有数据才连接
```sql
select * from person inner join address on person.pid=address.pid

pid  age  name  aid  pid(1)  city
1    11   小明  10   1       北京
1    11   小明  11   1       东京
2    22   小红  12   2       南京
```

# 左连接
左边的表的行都有，右边的没有就补null
```sql
select * from person left join address on person.pid=address.pid

pid  age  name  aid  pid(1)  city
1    11   小明  10   1       北京
1    11   小明  11   1       东京
2    22   小红  12   2       南京
3    33   小白  null null    null
```

# 右连接
右边的表的行都有，左边的没有就补null
```sql
select * from person right join address on person.pid=address.pid

pid  age  name  aid  pid(1)  city
1    11   小明  10   1       北京
1    11   小明  11   1       东京
2    22   小红  12   2       南京
null null null  13   4       西京
```

# 全连接
左边和右边的表的行都有，没有就补null，不过貌似mysql不支持全连接，反正navicat报错
```sql
select * from person full join address on person.pid=address.pid

pid  age  name  aid  pid(1)  city
1    11   小明  10   1       北京
1    11   小明  11   1       东京
2    22   小红  12   2       南京
3    33   小白  null null    null
null null null  13   4       西京
```

# NULL返回
如果某个sql语句返回的是Empty set，可以有两个办法当Empty set时返回NULL。一是用子sql包一下，二是使用ifnull语句。不过要注意select的只允许一列。
```sql
select id from t where false;
Empty set

select (select id from t where false) as name;
+------+
| name |
+------+
| NULL |
+------+

select ifnull((select id from t where false),null) as name;
+------+
| name |
+------+
| NULL |
+------+
```
---
createdAt: '2018-07-18'
updatedAt: '2018-07-18'
---

<!--more-->

背景：select出一个结果集之后，需要利用结果的每一行数据再进行操作，可以利用sql的游标来实现。

需求：有两个表：my_table和my_table2。获取my_table的id和name字段，更新到my_table2里。

简单方法（一开始没想到，吃惊。jpg）
```sql
update my_table,my_table2 set my_table2.name2=my_table.name where my_table.id=my_table2.id2
```

游标法
```sql
#据说在windows系统中写存储过程时，如果需要使用declare关键字来声明变量，需要添加delimiter关键字，否则会报错。但是没验证过，但起码加了不会报错。
delimiter
#检查是否已经存在名为my_procedure的方法，有则删掉
drop procedure if exists my_procedure;
#创建一个名叫my_procedure的方法
CREATE PROCEDURE my_procedure()
BEGIN
    #声明三个变量my_id,my_name和done
    #my_id和my_name表示select出来的id和name
    #done用来控制循环
    declare my_id int;
    declare my_name varchar(16);
    declare done int default false;
    #创建游标：declare 游标名 cursor for select语句
    declare my_cursor cursor for select id,name from my_table;
    #指定游标循环结束时的返回值（这句没看懂）
    declare continue HANDLER for not found set done = true;
    #打开游标
    open my_cursor;
    #遍历
    read_loop:loop
        #读取下一行数据到my_id和my_name里
        fetch my_cursor into my_id,my_name;
        if done then
            #如果结束就跳出循环
            leave read_loop;
        end if;
        #这里可以做自己的操作
        update my_table2 set name2=name where id2=id;
    end loop;
    #关闭游标
    close my_cursor;
END;
#上面只是创建了方法，这里调用方法
call my_procedure();
```

参考文献：

[MySQL游标的使用](https://www.jianshu.com/p/f9dcfc14e0b6 "MySQL游标的使用")
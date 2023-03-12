---
createdAt: '2018-05-10'
updatedAt: '2018-05-10'
---
JDBC是通过`Class.forName(String)`反射加载所需的驱动类。然后就可以通过jdk自带的`DriverManager`的静态方法获取一个数据库连接：`Connection`。通过这个Connection我们就可以对数据库进行增删查改了。要对数据库进行增删查改还是离不开sql。需要使用sql，调用Connection的方法创建一个`Statement`或者`PreparedStatement`对象。创建Statement就利用一句完整的sql就好了，但是不防止注入。而PreparedStatement的sql在参数上用问号代替，作为占位符。之后再填充这些占位符，其占位符是用下标指定，下标从1开始，是防止注入的。创建好PreparedStatement执行。在这里可以设置事务。如果是select，执行后返回一个`ResultSet`对象作为返回结果。可以通过这个结果获取列名，元组的数据等。如果是insert，delete或者update，会返回一个int，表示受此命令影响的行数。

<!--more-->

# JDBC的优化
1. Connection对象是线程不安全的，要不然就不会有说一个请求创建一个Connection对象，就不需要数据库连接池了。

2. 一直有个误区，其实数据库连接池是JDBC的一直优化手段，而不是两种方法。哪怕是使用了数据库连接池，使用JDBC的话也是直接操作connect和PreparedStatement的。当操作量大的时候，数据库连接池就有连接数控制，防止连接泄露等功能。但是如果操作量很少的话，就会有大量连接在数据库连接池里闲置了。

3. 对大量相同的sql操作使用批处理，在一次交互里处理大量的操作，而不是每个操作进行一次交互。批处理例子如下，能有效提高操作速度。

```java
package jdbc;

import java.sql.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by cellargalaxy on 18-5-10.
 */
public class Jdbc {
    public static void main(String[] args) throws ClassNotFoundException, SQLException {
        main();
    }

    public static final void main() throws ClassNotFoundException, SQLException {
        //加载mysql的驱动
        Class.forName("com.mysql.jdbc.Driver");
        String url = "jdbc:mysql://127.0.0.1:3306/mysql?useSSL=false";
        //通过url，账号密码获取Connection
        Connection connection = DriverManager.getConnection(url, "root", "pass");

        //执行事务前设置不提交
        connection.setAutoCommit(false);
        String sql = "select * from engine_cost";
        Object[] objects = new Object[]{};
        //用connection创建一个PreparedStatement
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        for (int i = 0; i < objects.length; i++) {//给问号填空
            preparedStatement.setObject(i + 1, objects[i]);
        }

        //执行PreparedStatement
        try (PreparedStatement ps = preparedStatement; ResultSet resultSet = preparedStatement.executeQuery()) {
            //从结果里获取列别名
            ResultSetMetaData resultSetMetaData = resultSet.getMetaData();
            String[] columnLabels = new String[resultSetMetaData.getColumnCount()];
            for (int i = 0; i < columnLabels.length; i++) {
                columnLabels[i] = resultSetMetaData.getColumnLabel(i + 1);
            }

            //把指针指到结果集的最后
            resultSet.last();
            //获取结果集有多少条结果
            Map<String, Object>[] maps = new Map[resultSet.getRow()];
            //把指针指到结果集的最前
            resultSet.beforeFirst();
            int i = 0;
            while (resultSet.next()) {
                maps[i] = new HashMap<String, Object>();
                for (String columnName : columnLabels) {
                    //通过列名获取相应的值
                    maps[i].put(columnName, resultSet.getObject(columnName));
                }
                i++;
            }

            for (Map<String, Object> map : maps) {
                System.out.println(map);
            }

            //事务完成后提交
            connection.commit();
        } catch (Exception e) {
            //发生异常回滚
            connection.rollback();
            e.printStackTrace();
        }
    }

    /**
     * 批量处理增删改
     * @param connection
     * @throws SQLException
     */
    public static final void main(Connection connection) throws SQLException {
        //批量处理要先设置不提交
        connection.setAutoCommit(false);
        String sql = "insert into tableName(id) values(?)";
        Object[] objects = new Object[]{"id"};
        PreparedStatement preparedStatement = connection.prepareStatement(sql);

        try (PreparedStatement ps = preparedStatement) {
            for (int i = 0; i < 10000; i++) {//一万次sql
                for (int j = 0; j < objects.length; j++) {
                    preparedStatement.setObject(j + 1, objects[j]);
                }
                preparedStatement.addBatch();//批量处理里添加一个

                if (i % 1000 == 0) {
                    int[] lens = preparedStatement.executeBatch();//每1000次提交一次批处理
                    System.out.println("批处理影响的行(?): "+Arrays.toString(lens));
                    connection.commit();//批处理完成后提交
                    preparedStatement.clearBatch();//清理之前的批处理
                }
            }

            //批处理完成后提交
            connection.commit();
        } catch (Exception e) {
            //批处理发生异常回滚
            connection.rollback();
            e.printStackTrace();
        }
    }
}

```

参考文章：

[JDBC中Connection解惑](http://shift-alt-ctrl.iteye.com/blog/1967020 "JDBC中Connection解惑")

[用Java向数据库中插入大量数据时的优化](http://geeklee.iteye.com/blog/1160949 "用Java向数据库中插入大量数据时的优化")
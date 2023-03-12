---
createdAt: '2018-05-15'
updatedAt: '2018-05-15'
---

<!--more-->

# mysql与mariadb
mariadb是mysql的一个分支，其为了使用和api上兼容mysql。mysql卖给了Sun，Sun被Oracle收购之后，为了避免mysql封源收费而出现的。

# ubuntu下安装mysql
```shell
sudo apt-get install mysql-server -y
sudo apt install mysql-client -y
sudo apt install libmysqlclient-dev -y

#查看是否安装成功
sudo netstat -tap | grep mysql

tcp 0 0 localhost:mysql *:* LISTEN 26138/mysqld
```

#卸载mysql
```shell
#centos
#查出来的都yum remove掉
sudo rpm -qa | grep mysql
sudo yum remove mysql mysql-server mysql-libs mysql-server
#查出来的都删掉
sudo find / -name mysql

#ubuntu
#查出来的都apt-get remove掉
sudo dpkg --list|grep mysql
sudo apt-get remove mysql-common
sudo apt-get autoremove --purge mysql-server-5.0
#最后清除残留数据
dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P
```

# centos安装mariadb
```shell
#安装
yum -y install mariadb-server

#初始化mariadb
mysql_secure_installation

NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MariaDB
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!

In order to log into MariaDB to secure it, we'll need the current
password for the root user.  If you've just installed MariaDB, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.

Enter current password for root (enter for none): //要你输入密码，默认是空密码，回车即可
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MariaDB
root user without the proper authorisation.

Set root password? [Y/n] y//是否要设置root的密码
New password: //新密码
Re-enter new password: //再次输入新密码
Password updated successfully!
Reloading privilege tables..
 ... Success!


By default, a MariaDB installation has an anonymous user, allowing anyone
to log into MariaDB without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] y//是否删除匿名用户
 ... Success!

Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] y//是否允许远程登录
 ... Success!

By default, MariaDB comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] y//是否删除test数据库
 - Dropping test database...
 ... Success!
 - Removing privileges on test database...
 ... Success!

Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] y//是否重新加载权限表
 ... Success!

Cleaning up...

All done!  If you've completed all of the above steps, your MariaDB
installation should now be secure.

Thanks for using MariaDB!
```

## centos卸载mariadb
```shell
#查看
rpm -qa | grep mariadb

mariadb-devel-5.5.56-2.el7.x86_64
mariadb-libs-5.5.56-2.el7.x86_64
mariadb-5.5.56-2.el7.x86_64
mariadb-server-5.5.56-2.el7.x86_64

#都卸载
rpm -e --nodeps mariadb-devel-5.5.56-2.el7.x86_64 mariadb-libs-5.5.56-2.el7.x86_64 mariadb-5.5.56-2.el7.x86_64 mariadb-server-5.5.56-2.el7.x86_64
警告：/var/log/mariadb/mariadb.log 已另存为 /var/log/mariadb/mariadb.log.rpmsave
警告：/etc/my.cnf 已另存为 /etc/my.cnf.rpmsave
```

# 其他
```shell
sudo systemctl [start|enable|stop|restart|reload|force-reload|status] mariadb

#修改编码
sudo vim /etc/my.cnf

[mysqld]
character-set-server=utf8
[mysql]
default-character-set=utf8
[client]
default-character-set=utf8

#允许非本地访问，注释掉bind-address
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf

user            = mysql
pid-file        = /var/run/mysqld/mysqld.pid
socket          = /var/run/mysqld/mysqld.sock
port            = 3306
basedir         = /usr
datadir         = /var/lib/mysql
tmpdir          = /tmp
lc-messages-dir = /usr/share/mysql
skip-external-locking
#
# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
#bind-address           = 127.0.0.1

#备份与恢复
#备份指定的多个数据库。
mysqldump -h host -u root -p --databases databasename > filename.sql
#备份所有的数据库
mysqldump -h host -u root -p --all-databases > all.sql
#恢复
mysqldump -h host -u root -p databasename < filename.sql
```
```sql
#查看字符串编码
mysql> show variables like '%char%';
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8                       |
| character_set_connection | utf8                       |
| character_set_database   | utf8                       |
| character_set_filesystem | binary                     |
| character_set_results    | utf8                       |
| character_set_server     | utf8                       |
| character_set_system     | utf8                       |
| character_sets_dir       | /usr/share/mysql/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.01 sec)

#创建用户，若要任意地址登录，host用%作通配符
create user 'username'@'host' IDENTIFIED BY 'password';

#删除用户
drop user 'username'@'host';

#修改密码
set password for 'username'@'host' = password('newpassword');

#授权，privileges为权限(insert,delete,select,update,all)，databasename和tablename可用*作通配符
grant privileges on databasename.tablename TO 'username'@'host';

#撤销授权
revoke privilege ON databasename.tablename FROM 'username'@'host';

#刷新
flush privileges;
```

参考文章

[MySQL创建用户与授权](https://www.jianshu.com/p/d7b9c468f20d "MySQL创建用户与授权")
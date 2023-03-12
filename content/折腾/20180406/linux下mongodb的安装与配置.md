---
createdAt: '2018-04-06'
updatedAt: '2018-04-06'
---

<!--more-->

linux下mongodb的安装很简单，下载个压缩包解压就能用。在https://www.mongodb.com/download-center#community ，下载最新版的压缩包，下载速度好慢，可以挂个代理下载。解压到一个合适的文件里。

```shell
mkdir /usr/local/mongodb
cd /usr/local/mongodb
sudo wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-3.6.3.tgz
sudo tar -zxvf mongodb-linux-x86_64-ubuntu1604-3.6.3.tgz
```

配置个环境变量方便使用

```shell
sudo vim /etc/bash.bashrc
加入
# set mongondb environment
export PATH=$PATH:/usr/local/mongodb/mongodb-linux-x86_64-ubuntu1604-3.6.3/bin
刷新环境变量
source /etc/bash.bashrc
```

测试一下，当然连不上，服务端都还没有启动

```shell
cellargalaxy:~$ mongo
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27017
2018-04-06T12:08:22.406+0800 W NETWORK  [thread1] Failed to connect to 127.0.0.1:27017, in(checking socket for error after poll), reason: Connection refused
2018-04-06T12:08:22.406+0800 E QUERY    [thread1] Error: couldn't connect to server 127.0.0.1:27017, connection attempt failed :
connect@src/mongo/shell/mongo.js:251:13
@(connect):1:6
exception: connect failed
```

接下来创建几个目录，用来存放数据文件

```shell
mkdir ~/file/mongodb/
mkdir ~/file/mongodb/db
mkdir ~/file/mongodb/log
```

启动服务端，参数见名之意。启动后你会发现文件夹下多了些文件。

```shell
mongod --maxConns=100 --port=27017 --bind_ip=127.0.0.1 --dbpath=/home/cellargalaxy/file/mongodb/db --logpath=/home/cellargalaxy/file/mongodb/log/mongodb.log
```

登录

```shell
mongo --host 127.0.0.1 --port 27017
mongo --host 127.0.0.1 --port 27017 -u "test" -p "123456" --authenticationDatabase "mycloud"
```
这时候登录是不需要账号密码的，第一是因为服务器启动的时候没有使用`--auth`参数，要求客户端登录要验证。第二我们还没有创建账号。还有一点，即使服务器使用了`--auth`参数，客户端（终端）还是能登录的，登录后也能切换数据库，但是当对数据库进行读写操作时就会报错，表示没有权限。

登录后，创建账号与授权。我创建一个名叫`mycloud`的数据库。创建一个账号为`test`，密码为`123456`的账号，授权到`mycloud`的数据库的读写操作。
```shell
> use mycloud
switched to db mycloud
> db.createUser(
  {
    user: "test",
    pwd: "123456",
    roles: [ { role: "readWrite", db: "mycloud" }]
  }
)
Successfully added user: {
    "user" : "test",
    "roles" : [
        {
            "role" : "readWrite",
            "db" : "mycloud"
        }
    ]
}
> db.auth("test","123456")
1
```
列举一下常见的权限
```
Read：允许用户读取指定数据库
readWrite：允许用户读写指定数据库
dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户
clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
root：只在admin数据库中可用。超级账号，超级权限
```
重启服务端
```shell
mongod --maxConns=100 --port=27017 --bind_ip=127.0.0.1 --dbpath=/home/cellargalaxy/file/mongodb/db --logpath=/home/cellargalaxy/file/mongodb/log/mongodb.log --auth
```
当再用`mongo --host 127.0.0.1 --port 27017`登录时
```shell
cellargalaxy:~$ mongo --host 127.0.0.1 --port 270mongo --host 127.0.0.1 --port 27017 -u "mycloud" -p "pass" --authenticationDatabase "mycloud"17
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27017/
MongoDB server version: 3.6.3
> use mycloud
switched to db mycloud
> db.mycloud.find()
Error: error: {
    "ok" : 0,
    "errmsg" : "not authorized on mycloud to execute command { find: \"mycloud\", filter: {}, $db: \"mycloud\" }",
    "code" : 13,
    "codeName" : "Unauthorized"
}
```
用`mongo --host 127.0.0.1 --port 27017 -u "test" -p "123456" --authenticationDatabase "mycloud"`登录
```shell
cellargalaxy:~$ mongo --host 127.0.0.1 --port 27017 -u "test" -p "123456" --authenticationDatabase "mycloud"
MongoDB shell version v3.6.3
connecting to: mongodb://127.0.0.1:27017/
MongoDB server version: 3.6.3
> use mycloud
switched to db mycloud
> db.mycloud.find()
>
```
可视化界面的客户端可以使用[robo3t](https://robomongo.org/download "robo3t")


参考文献

[Centos7安装 mongodb-3.2.3](https://my.oschina.net/Kxvz/blog/624675 "Centos7安装 mongodb-3.2.3")

[MongoDB 用户名密码登录](https://www.jianshu.com/p/79caa1cc49a5 "MongoDB 用户名密码登录")

[MongoDB 用户名密码登录](https://www.jianshu.com/p/79caa1cc49a5 "MongoDB 用户名密码登录")

[MongoDB 3.0 用户创建](http://www.cnblogs.com/zhoujinyi/p/4610050.html "MongoDB 3.0 用户创建")
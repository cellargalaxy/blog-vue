---
createdAt: '2018-05-15'
updatedAt: '2018-05-15'
---

<!--more-->

# 配置
mongodb有两种主从配置，一种是master/slave模式，另一种是Replica Set模式。由于Replica Set有故障自动切换功能，而master/slave没有，所以master/slave已经不被推荐使用。

启动三个数据库，先准备三套文件夹用来存放数据库文件。然后是启动命令。其中，`--replSet`参数指定Replica Set的名字，任意，最好有意义。
```shell
mongod --maxConns=100 --port=27017 --bind_ip=127.0.0.1 --dbpath=/home/cellargalaxy/file/mongodb/db --logpath=/home/cellargalaxy/file/mongodb/log/mongodb.log --replSet rs0

mongod --maxConns=100 --port=27018 --bind_ip=127.0.0.1 --dbpath=/home/cellargalaxy/file/mongodb/db2 --logpath=/home/cellargalaxy/file/mongodb/log2/mongodb.log --replSet rs0

mongod --maxConns=100 --port=27019 --bind_ip=127.0.0.1 --dbpath=/home/cellargalaxy/file/mongodb/db3 --logpath=/home/cellargalaxy/file/mongodb/log3/mongodb.log --replSet rs0
```

然后用`mongo --host 127.0.0.1 --port 27017`登录27017。

```json
//初始化
rs.initiate()
//添加数据库
rs.add("127.0.0.1:27017")
rs.add("127.0.0.1:27018")
rs.add("127.0.0.1:27019")
//查看各个数据库的状态
rs.status()
```

添加完后，这三个数据库会自己进行选举，决定谁是主数据库，谁是从数据库，效果：

```json
> rs.initiate()//初始化
{
    "info2" : "no configuration specified. Using a default configuration for the set",
    "me" : "127.0.0.1:27017",
    "ok" : 1,
    "operationTime" : Timestamp(1526472651, 1),
    "$clusterTime" : {
        "clusterTime" : Timestamp(1526472651, 1),
        "signature" : {
            "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
            "keyId" : NumberLong(0)
        }
    }
}
rs0:SECONDARY> //可以看到一开始他自己是从数据库（SECONDARY）
rs0:PRIMARY> //回车之后选举完成，自己就变成了主数据库（PRIMARY）
rs0:PRIMARY> rs.add("127.0.0.1:27017")//添加数据库
{
    "ok" : 0,
    "errmsg" : "Found two member configurations with same host field, members.0.host == members.1.host == 127.0.0.1:27017",
    "code" : 103,
    "codeName" : "NewReplicaSetConfigurationIncompatible",
    "operationTime" : Timestamp(1526472673, 1),
    "$clusterTime" : {
        "clusterTime" : Timestamp(1526472673, 1),
        "signature" : {
            "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
            "keyId" : NumberLong(0)
        }
    }
}
rs0:PRIMARY> rs.add("127.0.0.1:27018")
{
    "ok" : 1,
    "operationTime" : Timestamp(1526472678, 1),
    "$clusterTime" : {
        "clusterTime" : Timestamp(1526472678, 1),
        "signature" : {
            "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
            "keyId" : NumberLong(0)
        }
    }
}
rs0:PRIMARY> rs.add("127.0.0.1:27019")
{
    "ok" : 1,
    "operationTime" : Timestamp(1526472680, 1),
    "$clusterTime" : {
        "clusterTime" : Timestamp(1526472680, 1),
        "signature" : {
            "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
            "keyId" : NumberLong(0)
        }
    }
}
rs0:PRIMARY> rs.status()//查看各个数据库的状态
{
    "set" : "rs0",//Replica Set的名字
    "date" : ISODate("2018-05-16T12:11:28.944Z"),
    "myState" : 1,
    "term" : NumberLong(1),
    "heartbeatIntervalMillis" : NumberLong(2000),
    "optimes" : {
        "lastCommittedOpTime" : {
            "ts" : Timestamp(1526472680, 1),
            "t" : NumberLong(1)
        },
        "readConcernMajorityOpTime" : {
            "ts" : Timestamp(1526472680, 1),
            "t" : NumberLong(1)
        },
        "appliedOpTime" : {
            "ts" : Timestamp(1526472680, 1),
            "t" : NumberLong(1)
        },
        "durableOpTime" : {
            "ts" : Timestamp(1526472680, 1),
            "t" : NumberLong(1)
        }
    },
    "members" : [
        {
            "_id" : 0,
            "name" : "127.0.0.1:27017",//数据库地址
            "health" : 1,
            "state" : 1,
            "stateStr" : "PRIMARY",//主数据库
            "uptime" : 103,
            "optime" : {
                "ts" : Timestamp(1526472680, 1),
                "t" : NumberLong(1)
            },
            "optimeDate" : ISODate("2018-05-16T12:11:20Z"),
            "infoMessage" : "could not find member to sync from",
            "electionTime" : Timestamp(1526472651, 2),
            "electionDate" : ISODate("2018-05-16T12:10:51Z"),
            "configVersion" : 3,
            "self" : true
        },
        {
            "_id" : 1,
            "name" : "127.0.0.1:27018",
            "health" : 1,
            "state" : 2,
            "stateStr" : "SECONDARY",
            "uptime" : 10,
            "optime" : {
                "ts" : Timestamp(1526472680, 1),
                "t" : NumberLong(1)
            },
            "optimeDurable" : {
                "ts" : Timestamp(1526472680, 1),
                "t" : NumberLong(1)
            },
            "optimeDate" : ISODate("2018-05-16T12:11:20Z"),
            "optimeDurableDate" : ISODate("2018-05-16T12:11:20Z"),
            "lastHeartbeat" : ISODate("2018-05-16T12:11:28.385Z"),
            "lastHeartbeatRecv" : ISODate("2018-05-16T12:11:27.388Z"),
            "pingMs" : NumberLong(0),
            "syncingTo" : "127.0.0.1:27019",
            "configVersion" : 3
        },
        {
            "_id" : 2,
            "name" : "127.0.0.1:27019",
            "health" : 1,
            "state" : 2,
            "stateStr" : "SECONDARY",
            "uptime" : 8,
            "optime" : {
                "ts" : Timestamp(1526472680, 1),
                "t" : NumberLong(1)
            },
            "optimeDurable" : {
                "ts" : Timestamp(1526472680, 1),
                "t" : NumberLong(1)
            },
            "optimeDate" : ISODate("2018-05-16T12:11:20Z"),
            "optimeDurableDate" : ISODate("2018-05-16T12:11:20Z"),
            "lastHeartbeat" : ISODate("2018-05-16T12:11:28.386Z"),
            "lastHeartbeatRecv" : ISODate("2018-05-16T12:11:28.898Z"),
            "pingMs" : NumberLong(0),
            "syncingTo" : "127.0.0.1:27017",
            "configVersion" : 3
        }
    ],
    "ok" : 1,
    "operationTime" : Timestamp(1526472680, 1),
    "$clusterTime" : {
        "clusterTime" : Timestamp(1526472680, 1),
        "signature" : {
            "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
            "keyId" : NumberLong(0)
        }
    }
}
```
# 测试
1. 先连上27018，从数据库要对主数据库读取，还需要到从数据库进行设置。
```json
rs.slaveOk()
```

2. 回到27017插入数据。跟mysql一样，只有主数据库才能写，全部数据库都能读
```json
rs0:PRIMARY> use mycloud
switched to db mycloud
rs0:PRIMARY> db.mycloud.insert({name:'name1',age:11})
WriteResult({ "nInserted" : 1 })
rs0:PRIMARY> db.mycloud.find()
{ "_id" : ObjectId("5afc24bc37f9ecd1e677ee57"), "name" : "name1", "age" : 11 }
```

3. 又回到27018，看看数据同步了没
```json
rs0:SECONDARY> use mycloud
switched to db mycloud
rs0:SECONDARY> db.mycloud.find()
{ "_id" : ObjectId("5afc24bc37f9ecd1e677ee57"), "name" : "name1", "age" : 11 }
```

4. 再测试一下27019，先不rs.slaveOk()
```json
rs0:SECONDARY> use mycloud
switched to db mycloud
rs0:SECONDARY> db.mycloud.find()
Error: error: {
    "operationTime" : Timestamp(1526474043, 1),
    "ok" : 0,
    "errmsg" : "not master and slaveOk=false",
    "code" : 13435,
    "codeName" : "NotMasterNoSlaveOk",
    "$clusterTime" : {
        "clusterTime" : Timestamp(1526474043, 1),
        "signature" : {
            "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
            "keyId" : NumberLong(0)
        }
    }
}
```

5. 对27019执行rs.slaveOk()
```json
rs0:SECONDARY> rs.slaveOk()
switched to db mycloud
rs0:SECONDARY> db.mycloud.find()
{ "_id" : ObjectId("5afc24bc37f9ecd1e677ee57"), "name" : "name1", "age" : 11 }
```

# 故障自动切换
故障自动切换是Replica Set才有，master/slave没有的功能。故障自动切换就是当主数据库挂了，其他从数据库会自行进行选举，选择出新的主数据库。如果停掉主数据库，等一会，在其他从数据库里回车或者用rs.status()就能查看到主数据库切换了。

# 不足
现在数据库是不设防，不需要密码登录的。目前还没找到密码登录的主从同步的方法。

参考文章：
[mongodb 副本集（Replica Set）搭建](https://deepzz.com/post/mongodb-replica-set.html "mongodb 副本集（Replica Set）搭建")

[MongoDB Replication Set 的配置](http://gunner.me/archives/861 "MongoDB Replication Set 的配置")

[[MongoDB] 安装MongoDB配置Replica Set](http://www.cnblogs.com/hiddenfox/p/mongodb-install-config-replica-set.html "[MongoDB] 安装MongoDB配置Replica Set")

[学习MongoDB(二) Replica Set集群配置](http://www.cnblogs.com/daxin/p/5040121.html "学习MongoDB(二) Replica Set集群配置")
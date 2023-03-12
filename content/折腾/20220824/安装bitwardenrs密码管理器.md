我没有苹果系的东西，app的密码基本我都是自己记的，对密码同步需求几乎都在汗牛充栋的web密码。
一直以来都有听闻各种密码管理器，1Password、keepass的，但由于感觉迁移有风险~~懒~~，所以一直在使用谷歌浏览器来同步密码。

直到在v2ex看了篇文章[chrome 密码泄漏了， 才知道用 chrome 保存密码等于裸奔](https://www.v2ex.com/t/872745)。
对于谷歌浏览器的明文存储还是太过震撼。还是铁定了心迁移吧。

选型直接选v2ex文章里介绍的bitwarden（vaultwarden）了。
bitwarden是一套服务端客户端都开源的密码管理套件。
但官方的服务端资源消耗太大，所以有人用rust重写过了服务端，原名bitwarden_rs，现改名叫vaultwarden。
vaultwarden直接提供docker镜像，存储默认使用sqlite。

+ https://github.com/dani-garcia/vaultwarden
+ https://hub.docker.com/r/vaultwarden/server
+ [Vaultwarden Wiki 中文版](https://rs.ppgg.in/)

## 安装

先启动服务，进`ip:port:7808`就可以注册。这里得先注册一个账号。

```shell
sudo docker volume create vaultwarden_data
sudo docker run -d \
--restart=always \
--name vaultwarden \
-v vaultwarden_data:/data \
-p 7808:80 \
vaultwarden/server:alpine


```

注册完之后，就能进入个人页面了。
但显然这样子阿猫阿狗都能来注册，是不行的。
我们把实例删掉，加两个环境变量，禁止新用户注册和不允许邀请用户，再创建一个新的实例。
新实例起来之后，就不能在注册了。

```shell
sudo docker run -d \
--restart=always \
--name vaultwarden \
-e SIGNUPS_ALLOWED=false \
-e INVITATIONS_ALLOWED=false \
-v vaultwarden_data:/data/ \
-p 7808:80 \
vaultwarden/server:alpine
```

## 客户端使用

待体验

## 数据备份

使用[vaultwarden-backup](https://github.com/ttionya/vaultwarden-backup/blob/master/README_zh.md)来备份。
这个docker镜像使用rclone来将备份的问题推送到远端。看来看去还有有个webdav比较方便。
首先需要在vaultwarden的机器里执行个命令，通过rclone来生成远端链接的配置，配置会保存在一个volume里。
创建的这个配置的名称，官方文档推荐叫`BitwardenBackup`。

```shell
sudo docker run --rm -it \
--mount type=volume,source=vaultwarden-rclone-data,target=/config/ \
ttionya/vaultwarden-backup \
rclone config
```

配完之后可以这样来检查是否配置成功

```shell
sudo docker run --rm -it \
--mount type=volume,source=vaultwarden-rclone-data,target=/config/ \
ttionya/vaultwarden-backup \
rclone config show

# webdav example
[BitwardenBackup]
type = webdav
url = https://com.com/
vendor = other
user = admin
pass = admin
```

接下来，vaultwarden的实例名称需要叫`vaultwarden`，否则要在`--volumes-from`里指定。
环境变量一定得加，默认就不是vaultwarden默认的路径。默认设每小时的05分自动备份。

```shell
sudo docker run -d \
--restart=always \
--name vaultwarden_backup \
--volumes-from=vaultwarden \
--mount type=volume,source=vaultwarden-rclone-data,target=/config/ \
-e TIMEZONE="Asia/Shanghai" \
-e DATA_DIR="/data" \
-e CRON="5 * * * *" \
-e ZIP_PASSWORD="WHEREISMYPASSWORD?" \
-e BACKUP_KEEP_DAYS="30" \
ttionya/vaultwarden-backup
```

参考文章

+ https://www.psay.cn/toss/136.html
+ https://blog.im.ci/study-notes/880/
+ https://laosu.ml/2020/07/18/用bitwarden自建密码管理系统/
+ https://blog.ous50.moe/2021/03/12/vaultwarden搭建/

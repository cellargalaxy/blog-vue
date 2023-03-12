---
createdAt: '2020-02-21'
updatedAt: '2020-02-21'
---
# 前记
之前刚入手n1的时候就是想倒腾Armbian做小pc的，但是当时出于几个原因就放弃了。

一是当时以为，只要有断电强关机，系统就会崩掉。
实际上并不会，当时崩了以为只是以为我自己搞崩的，然后无法重启只能强行断电，然后以为断电搞崩了。。。

二是我没成功安装中文输入法。

三是内存只有2G，浏览器打开三四个非视频页面还行的，再多就卡爆

四是视频播放不支持硬解，看网页视频或者播放本地视频只能到720，不然就是看ppt加卡爆。

但是生命不息，折腾不止，心想给n1刷个Armbian桌面版能做个垃圾小pc，再装上docker能做个下载机和垃圾nas，最后再在docker装个openwrt来个旁路由，想想都觉得自己血赚。。。

# 注意
***下面的操作步骤最好按顺序，不然有可能会莫名其妙的崩掉。已经下面会有几次reboot命令，请不要偷懒，最后才来reboot，否则也可能会莫名其妙的崩掉。***

<!--more-->

# 准备
必须
1. [斐讯T1、N1官方系统降级工具.zip](/file/blog/code/20200221/%E6%96%90%E8%AE%AFT1%E3%80%81N1%E5%AE%98%E6%96%B9%E7%B3%BB%E7%BB%9F%E9%99%8D%E7%BA%A7%E5%B7%A5%E5%85%B7.zip)
2. [usbit.zip](/file/blog/code/20200221/usbit.zip)
3. [meson-gxl-s905d-phicomm-n1-xiangsm.7z](/file/blog/code/20200221/meson-gxl-s905d-phicomm-n1-xiangsm.7z)
4. [Armbian_5.77_Aml-s905_Ubuntu_bionic_default_5.0.2_20190401.img.xz](/file/blog/code/20200221/Armbian_5.77_Aml-s905_Ubuntu_bionic_default_5.0.2_20190401.img.xz)
5. [Armbian_5.77_Aml-s905_Ubuntu_bionic_default_5.0.2_desktop_20190401.img.xz](/file/blog/code/20200221/Armbian_5.77_Aml-s905_Ubuntu_bionic_default_5.0.2_desktop_20190401.img.xz)

可选/备份
1. [BACKUP-s9xxx-emmc.img.gz，原系统备份](/file/blog/code/20200221/BACKUP-s9xxx-emmc.img.gz)

# 降级
***先断网，避免降级之后n1又自动升级。我没试过联网状态下操作会咋样，反正大家都这么说，那就保险起见照做呗。***

降级参照webpad大佬的恩山教程即可：https://www.right.com.cn/forum/thread-340279-1-1.html。
斐讯T1、N1官方系统降级工具.zip里面也有操作的截图。
对于n1来说就是接上电源、网线、显示器和鼠标，用鼠标点几下版本号，下面就会出现一个【打开adb】的弹框。然后记录下n1所获取到的ip即可。

我一开始n1通电开机我是没有断网的，查着有线，不知道是不是这个原因，n1显示的ip竟然是202.x.x.x。断网重启n1之后依然如此，路由器没没有显示n1所获取的ip。
不过我没考究过这个202.x.x.x的ip是不是当时没断网我路由器的出口ip，反正断网之后我让让n1连wifi，就获取到了192的ip了。

然后回到电脑里，执行斐讯T1、N1官方系统降级工具.zip里面的onekey文件夹下面的run.bat选择n1降级，按提示天ip就好。
成功降级之后，n1所显示的版本号是不会改变的，怕的就降级多几遍呗。

# Armbian镜像与dtb选择
参考：https://www.right.com.cn/forum/thread-510423-1-1.html。
经过无数恩山大佬的倒腾，貌似目前网上最主流的稳定版本是Armbian5.77。
dtb使用xiangsm的meson-gxl-s905d-phicomm-n1-xiangsm.dtb。

听网上说，官方作者由于侵权，把之前旧的镜像全删了，我找了好久才找到了5.7.7ubuntu的server版和桌面版。
更多镜像询问谷歌或者到这里翻翻：https://loksado.com/2020/02/download-armbian-linux-untuk-hg680p-dan-b860h-amlogic-s905-p212/

# 制作Armbian启动盘
网上很多人都用usbit.zip制作驱动盘，小巧不用安装。
写入完成镜像之后，需要把meson-gxl-s905d-phicomm-n1-xiangsm.dtb文件复制到dtb文件夹下，然后修改uEnv.ini文件。
```
dtb_name=/dtb/meson-gxl-s905d-phicomm-n1-xiangsm.dtb
```
***跟多人都说千万不要在安卓系统开机的情况下插入U盘，否则U盘中的文件权限会被安卓系统篡改。我没试过，反正照做就是。***

# n1切换为启动盘模式
在斐讯T1、N1官方系统降级工具里，onekey/data文件夹下有个adb.exe。执行
```shell
adb connect 斐讯IP
adb shell reboot update
```
n1就会重启，要抓紧时间在重启的时候把U盘插到靠近HDMI的USB口，然后就会在U盘里启动。
如果错失了重启插入U盘的机会，n1会进入貌似安卓拯救状态的界面，就需要再次执行上面的adb重新来过了。
（不是很懂，但可能跟BIOS找不到启动盘报错差不多意思吧）

# 原系统备份与还原
如无意外机会从U盘里启动成功，最好先备份一下原系统，搞崩了，或者需要刷其他东西能恢复。
备份完成，在pc里通过scp把备份的镜像复制出来备份（原来Windows也自带scp命令）。
要恢复原系统，再弄个启动盘，在启动盘里刷原系统即可。

ddbr可以备份的不单止安卓系统，也可以备份和恢复armbian，所以如果弄好了一个自己满意的系统状态，可以ddbr一下备份。以后把系统搞崩了，用个u盘装个***全新的***armbian（因为我发现，直接把自己ddbr下来的进行压到U盘里，虽然能正常启动和使用，但是没有ddbr和nand–sata-install命令）。然后把之前备份好的镜像scp到U盘里恢复。
```shell
#备份输入命令顺序
ddbr -> b -> y -> y
#会备份到/ddbr文件夹下
ll /ddbr
#恢复输入命令顺序
ddbr -> r -> y -> y
```

# 把Armbian刷进emmc
命令执行完成后重启即可
```shell
sudo nand–sata-install
```

# 网络问题
这个网络问题我没有明显感觉，但是有教程说到，这里备份一下做法。

armbian启动的时候没有等待网卡分配到IP，会导致一些监听网络的程序无法正常工作，需要大家修改一下网卡的模式为auto，即可强制开机等待网络分配（当然太久分配不到也会超时进入系统）
```shell
cat /etc/network/interfaces
vim /etc/network/interfaces
source /etc/network/interfaces.d/*
 
# Wired adapter #1
auto eth0
#allow-hotplug eth0
```

我在路由器上给N1分配静态IP的时候发现，armbian的有线网卡每次重启后MAC地址都会变（这个我没成功，可能我改错了?）
```shell
cat /etc/network/interfaces
vim /etc/network/interfaces
source /etc/network/interfaces.d/*

# Wired adapter #1
allow-hotplug eth0
no-auto-down eth0
iface eth0 inet dhcp
hwaddress 4e:03:88:54:39:93
```

# 替换apt源
```shell
vim /etc/apt/sources.list
```
Ubuntu的
```shell
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ bionic main restricted universe multiverse
#deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ bionic main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ bionic-security main restricted universe multiverse
#deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ bionic-security main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ bionic-updates main restricted universe multiverse
#deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ bionic-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ bionic-backports main restricted universe multiverse
#deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu-ports/ bionic-backports main restricted universe multiverse
```
Debian的
```shell
deb [ arch=arm64,armhf ] https://mirrors.tuna.tsinghua.edu.cn/debian/ stretch main contrib non-free
#deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ stretch main contrib non-free
deb [ arch=arm64,armhf ] https://mirrors.tuna.tsinghua.edu.cn/debian/ stretch-updates main contrib non-free
#deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ stretch-updates main contrib non-free
deb [ arch=arm64,armhf ] https://mirrors.tuna.tsinghua.edu.cn/debian/ stretch-backports main contrib non-free
#deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ stretch-backports main contrib non-free
deb [ arch=arm64,armhf ] https://mirrors.tuna.tsinghua.edu.cn/debian-security/ stretch/updates main contrib non-free
#deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security/ stretch/updates main contrib non-free
#deb [ arch=arm64,armhf ] https://mirrors.tuna.tsinghua.edu.cn/debian/ sid main contrib non-free
```
执行下面`sudo apt-get upgrade`的命令，可能在半途报错说啥啥啥文件/文件夹只读，在这种情况下重启n1再执行就好。或者把这句命令留到最后，执行之前ddbr一下现有系统，反正不更新又不会死。这点最后会再解释。
```shell
sudo apt-get update
sudo apt-get upgrade
```

# swap占用过高，但物理内存还有空余
临时调整
```shell
sudo sysctl vm.swappiness=10
vm.swappiness = 10

cat /proc/sys/vm/swappiness
10
```

永久调整
```shell
sudo vim /etc/sysctl.conf
vm.swappiness=10

#激活设置：
sudo sysctl -p
```

# 设置时区为北京时间
```shell
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone
date -R
```

# 删除默认 DNS
```shell
rm /etc/resolvconf/resolv.conf.d/head && touch /etc/resolvconf/resolv.conf.d/head
```

# 支持中文显示
安装中文包和字体
```shell
sudo apt-get install language-pack-zh-hans
sudo apt-get install fonts-droid-fallback ttf-wqy-zenhei ttf-wqy-microhei fonts-arphic-ukai fonts-arphic-uming
```
修改语言
```shell
sudo vim /etc/default/locale
LANG="zh_CN.UTF-8"
LANGUAGE="zh_CN:zh"
LC_NUMERIC="zh_CN"
LC_TIME="zh_CN"
LC_MONETARY="zh_CN"
LC_PAPER="zh_CN"
LC_NAME="zh_CN"
LC_ADDRESS="zh_CN"
LC_TELEPHONE="zh_CN"
LC_MEASUREMENT="zh_CN"
LC_IDENTIFICATION="zh_CN"
LC_ALL="zh_CN.UTF-8"

sudo vim /etc/environment
LANG="zh_CN.UTF-8"
LANGUAGE="zh_CN:zh"
LC_NUMERIC="zh_CN"
LC_TIME="zh_CN"
LC_MONETARY="zh_CN"
LC_PAPER="zh_CN"
LC_NAME="zh_CN"
LC_ADDRESS="zh_CN"
LC_TELEPHONE="zh_CN"
LC_MEASUREMENT="zh_CN"
LC_IDENTIFICATION="zh_CN"
LC_ALL="zh_CN.UTF-8"
```
最后
```shell
sudo locale-gen
reboot
```

# 安装谷歌拼音输入法

安装
```shell
sudo apt install fcitx fcitx-tools fcitx-config* fcitx-frontend* fcitx-module* fcitx-ui-* presage

sudo apt install fcitx-pinyin            # 拼音
sudo apt install fcitx-sunpinyin         # sun拼音
sudo apt install fcitx-googlepinyin      # google拼音
sudo apt install fcitx-table-wubi-large  # 五笔
```

设置fcitx
```shell
sudo im-config -s fcitx -z default
```

重启
```shell
reboot
```

重启之后右上角应该会有个小键盘，虽然在fcitx里，我依然是没显示任何的输入法可以+，但是按ctrl+space可以切换输入法了。

# 安装docker
使用官方的脚本，如果安装他教程的命令一个个执行，最后还是找不到docker-ce。https://yeasy.gitbooks.io/docker_practice/install/ubuntu.html
```shell
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
```

# 安装openwrt做旁路由
首先在armbian里开启一个叫网卡混杂模式，功能应该是让openwrt自己有一个网卡，单独向路由器获取一个ip
```shell
sudo ip link set eth0 promisc on
sudo modprobe pppoe
```
然后在docker里创建一个网卡
```shell
sudo docker network create -d macvlan --subnet=192.168.123.0/24 --gateway=192.168.123.1 -o parent=eth0 macnet
```
之后安装openwrt，有两个版本。一个是`kanshudj/n1-openwrtgateway:r9.10.1`，另一个是`unifreq/openwrt-aarch64:r9.10.24`。unifreq的略大，我只用来科学上网，所以就挑了kanshudj的
```shell
sudo docker run -d \
--name openwrt \
--restart always \
--network macnet \
--privileged \
kanshudj/n1-openwrtgateway:r9.10.1 /sbin/init

sudo docker run -d \
--name openwrt \
--restart always \
--network macnet \
--privileged \
unifreq/openwrt-aarch64:r9.10.24 /sbin/init
```
安装完成之后，进入openwrt容器里的命令行环境，修改网卡配置。然后重启openwrt
```shell
vi /etc/config/network

config interface 'loopback'
        option ifname 'lo'
        option proto 'static'
        option ipaddr '127.0.0.1'
        option netmask '255.0.0.0'

config globals 'globals'
        option ula_prefix 'fd2f:ea21:0e02::/48'

config interface 'lan'
        option type 'bridge'
        option ifname 'eth0'
        option proto 'static'
        option ipaddr '192.168.123.2' #openwrt的静态ip
        option netmask '255.255.255.0'
        option gateway '192.168.123.1' #路由器ip
        option dns '192.168.123.1' #DNS，按自己喜欢改

config interface 'vpn0'
        option ifname 'tun0'
        option proto 'none'
```
我好久没用过openwrt了，以至于差点找不到怎么配透明代理。配透明代理在【服务】-【影梭加速 Plus+】-【服务节点】里添加SS/SSR/V2RAY。默认的透明代理端口是`1234`，最可续的是没找到如何自定义配置文件。当上面的【访问Google-访问正常】后，例如在电脑的【控制面板/网络和 Internet/网络连接】里，把网关设置为openwrt的ip，按道理就翻出去了。需要注意一点是，我试过把n1的armbian的网关也设置为openwrt的ip，然后发现就翻不出去了，可能有什么冲突。

# 安装火狐浏览器
```shell
sudo apt-get install firefox
sudo apt-get install firefox-locale-zh-hans
```

# Docker日志限制
一下配置只对新创建的容器生效，现有容器请remove再建
```shell
sudo vim /etc/docker/daemon.json

{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn"
  ],
  "log-driver":"json-file",
  "log-opts": {"max-size":"5m", "max-file":"3"}
}

sudo systemctl daemon-reload
sudo systemctl restart docker
```
清理日志脚本
```shell
vim clean_docker_log.sh

#!/bin/sh
echo "======== start clean docker containers logs ========"
logs=$(find /var/lib/docker/containers/ -name *-json.log)
for log in $logs
        do
                echo "clean logs : $log"
                cat /dev/null > $log
        done
echo "======== end clean docker containers logs ========"

chmod +x clean_docker_log.sh
sudo ./clean_docker_log.sh
```

# 清理
```shell
du -sh /var/cache/apt/archives

sudo apt-get clean
sudo apt-get autoclean
sudo apt-get autoremove
```

# 开机挂载U盘
```shell
sudo blkid

sudo vim /etc/fstab
UUID=B07C12B77C1277F4 /media/user/upan ntfs defaults 0 1
```

# 一些docker镜像
```shell
sudo docker volume create caddy_data 
sudo docker run -d \
--name caddy \
--restart=always \
-v /caddy/Caddyfile:/etc/Caddyfile \
-v caddy_data:/root/.caddy \
--net=host \
jessestuart/caddy

sudo docker volume create portainer_data
sudo docker run -d \
--name portainer \
--restart=always \
-p 8000:8000 \
-p 9000:9000 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v portainer_data:/data \
portainer/portainer:latest

sudo docker run -d \
--name v2ray \
--restart=always \
-v /doc/v2ray:/etc/v2ray \
-p 10808:10808 \
-p 10809:10809 \
v2fly/v2fly-core:v4.22.1

sudo docker run -d \
--name samba \
--restart=always \
-p 137:137/udp \
-p 138:138/udp \
-p 139:139 \
-p 445:445 \
-p 445:445/udp \
--hostname 'aml' \
-v /media/user/upan:/share/folder \
elswork/samba -u "user:password" -s "upan:/share/folder:rw:user"

sudo docker volume create filebrowser_data
sudo docker run -d \
--name filebrowser \
--restart always \
-e WEB_PORT=9900 \
-p 9900:9900 \
-v filebrowser_data:/config \
-v /media/user/upan:/myfiles \
--mount type=tmpfs,destination=/tmp \
80x86/filebrowser:latest

git clone https://github.com/Auska/docker-transmission.git
sudo docker build -t transmission .

sudo docker volume create transmission_data_config
sudo docker volume create transmission_data_watch

sudo docker run -d \
--name transmission \
--restart always \
-v transmission_data_config:/config \
-v /media/user/upan/transmission:/downloads \
-v transmission_data_watch:/watch \
-p 9091:9091 \
-p 51413:51413 \
-p 51413:51413/udp \
transmission:latest

# 这个镜像好像做了什么防止反代的东西，需要docker的内外部端口一致
# 所以只能先用8080，在web修改端口后，remove掉容器再run一个
sudo docker volume create qbittorrent_config
sudo docker volume create qbittorrent_cache
sudo docker volume create qbittorrent_local

sudo docker run -d \
--name qbittorrent \
--restart always \
-p 6881:6881 \
-p 6881:6881/udp \
-p 8080:8080 \
-v qbittorrent_config:/data/.config \
-v qbittorrent_cache:/data/.cache \
-v qbittorrent_local:/data/.local \
-v /media/user/upan/bt:/data/downloads \
gists/qbittorrent


# 下面这个qbittorrent不知道为啥没速度
sudo docker volume create qbittorrent_data

sudo docker run -d \
--name qbittorrent \
--restart always \
-e TZ=Asia/Shanghai \
-e WEBUI_PORT=9092 \
-p 6881:6881 \
-p 6881:6881/udp \
-p 9092:9092 \
-v qbittorrent_data:/config \
-v /media/user/upan/qbittorrent:/downloads \
linuxserver/qbittorrent
```

# 现有问题
1. 狗逼谷歌不知道为什么在2019年年底禁止了linux的部分浏览器登录谷歌账号，所以chromium登录不来谷歌。虽然火狐可以登录，但无法同步书签也就废了一半了。
2. ~~使用docker pull拉的镜像好像很多都无法启动，可能拉的是非arm的编译版本。~~
~~portainer是可以直接pull的，v2ray需要自己写个Dockerfile来构建，才会下载arm版本，filebrowser研究了一轮依然无解。
希望openwrt没有这样的问题。~~
3. 有些镜像只编译好了AMD版本，没ARM，有些是可以通过指定版本号来指定ARM的，具体看吧
4. 我在倒腾的时候，会遇到搞着搞着，armbian原本的那九百多M的swap不见了的情况，有可能是下面两条命令或者之一导致的。没找到恢复的方案

```shell
# 残余的配置文件
sudo dpkg --list | grep "^rc" | cut -d " " -f 3 | xargs sudo dpkg --purge

# 删除过时的软件包
sudo aptitude purge ~o
```


参考文章：

[斐讯N1探索手记#1 – 降级并刷入armbian系统](https://luotianyi.vc/1306.html)

[斐讯N1折腾记 - Armbian 5.77 刷入与优化](https://www.dragoncave.me/2019/07/armbian-on-n1.html)

[斐讯N1 – 完美刷机Armbian教程](https://yuerblog.cc/2019/10/23/%E6%96%90%E8%AE%AFn1-%E5%AE%8C%E7%BE%8E%E5%88%B7%E6%9C%BAarmbian%E6%95%99%E7%A8%8B/)

[N1 备份 + 刷机 + 安装 Armbian](https://leeyr.com/323.html)

[Ubuntu的中文乱码问题 [完美解决]](https://blog.csdn.net/weixin_39792252/article/details/80415550)

[Ubuntu 在命令下，安装中文环境的方法。](https://blog.csdn.net/zhangchao19890805/article/details/52743380)

[某科学的 T1 盒子刷 Armbian 调教笔记](https://ibcl.us/PhicommT1-Armbian_20190825/)

[Ubuntu安装Fcitx以及Fcitx输入中文不显示候选词框的解决办法](https://blog.csdn.net/qq_21397217/article/details/52447263)

[ubuntu 16.04 安装谷歌拼音输入法](https://blog.csdn.net/WangJiankun_ls/article/details/65628963)

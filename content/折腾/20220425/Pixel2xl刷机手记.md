# 2023-02-18

手痒又刷了一下。这次把twrp刷成功了，再简单记录一下。

1. 进bootloader，刷ROM，操作跟下面写的一样。先刷ROM是因为我发现刷ROM会覆盖掉twrp
   1. 解压ROM的zip包，进bootloader，用最新版fastboot，改改脚本里的fastboot路径，执行脚本
2. 进bootloader，刷twrp。操作跟twrp官网里写的一样
   1. `fastboot boot twrp-3.6.1_9-0-taimen.img`，临时启动twrp
   2. 把twrp的zip文件传到手机里，在twrp安装zip，完成永久刷入
3. 之前刷twrp不成功的表现，是boot临时启动twrp后，手机卡在谷歌logo里，进不去twrp
   1. 这次先用reallysnow的SHRP，永久刷入SHRP
   2. 之后再刷twrp就能成功启动了

# 前期准备

twrp刷入并不成功，目前不晓得啥原因。 但由于没有太需要twrp，所以就先放弃了。 可以直接调到刷rom那步。

我下载的都是最新的

## rom下载

最新的版本貌似永远停留在2020年十二月了。

https://developers.google.com/android/images#taimen

lineageos还有更新

https://download.lineageos.org/taimen

```
taimen-rp1a.201005.004.a1-factory-2f5c4987.zip
```

## 下载twrp

twrp起码到2022三月还有更新。

https://twrp.me/google/googlepixel2xl.html

```
twrp-3.6.1_9-0-taimen.img
twrp-installer-3.6.1_9-0-taimen.zip
```

## 下载fastboot

ubuntu安装安卓的fastboot，在安装ROM时提示版本太低，还是去官网下载了个新的

https://developer.android.com/studio/releases/platform-tools

# 解锁

待补充。我买到手已经是解锁了的，所以没操作

# 步骤

1. 刷入临时twrp
2. 刷入ROM
3. 刷入永久twrp

# 刷入临时twrp

1. `adb devices`查看设备列表
2. 关机后同时按开机键和音量下键/`adb reboot bootloader`进入bootloader模式
3. `fastboot devices`检查设备列表
4. `fastboot boot twrp-3.6.1_9-0-taimen.img`刷入

# 刷入ROM

1. 解压fastboot工具和rom
2. 将解压出来的fastboot文件夹里的全部文件拷贝一份到rom的文件夹里
3. 得把fastboot文件夹里全部文件都拷贝，会依赖到文件夹里其他文件，不然刷到中途会失败
4. 修改一下`flash-all.sh`，改成使用当前路径的fastboot
5. 手机进入fastboot模式
6. `fastboot devices`检查设备列表
7. 直接`flash-all.sh`

或者

```
adb sideload taimen-rp1a.201005.004.a1-factory-2f5c4987.zip
```

# 刷入永久twrp

选择高级 > sideload进入sideload

```
adb sideload twrp-installer-3.6.1_9-0-taimen.zip
```

其他

这里主要说下进入recovery的方式：首先进入fastboot，然后通过音量键进入recovery，首次进入会看到一个"no command"的界面，当出现这个界面后需要长按power键，然后按一下音量up键，这样才能进入recovery模式；


参考文献

+ https://reallysnow.moe/archives/244.html
+ https://lemisky.github.io/2020/11/30/Pixel-XL-%E5%88%B7%E6%9C%BA%E7%9B%B8%E5%85%B3/
+ https://www.jianshu.com/p/4017e9d6541c
+ https://www.itfanr.cc/2018/10/16/google-pixel-unlock-bl-and-root/
+ https://blog.csdn.net/weixin_45472158/article/details/108441357
+ https://blog.csdn.net/weixin_45472158/article/details/108441357
+ https://blog.csdn.net/achirandliu/article/details/105028423
+ https://ceshidao.com/how-to-get-magisk-working-on-pixel-2-xl/

电信破解相关的

+ https://sandyfffeng.com/2020/05/24/google-pixel-2-%E7%A0%B4%E8%A7%A3%E7%94%B5%E4%BF%A14g-%E5%85%A8%E6%95%99%E7%A8%8B%EF%BC%88mac-windows-%E9%80%9A%E7%94%A8%EF%BC%89/
+ https://blog.isteed.cc/post/4291184207/
+ https://gist.github.com/coeusite/86f6318c13c5bc15aef13345f1bb3ed4
+ https://www.jianshu.com/p/075ed256a85d
+ https://www.v2ex.com/t/395935
+ https://www.v2ex.com/t/598302

无需root电信破解

+ https://android.poppur.com/jiaocheng/10416.html

一代的

+ https://www.berlinchan.com/2019/09/update-android-10-and-flash-modem-for-china-telecom-4g
+ https://www.somedoc.net/?p=4263
+ http://www.gandalf.site/2018/11/google-pixel-4g.html
+ https://www.v2ex.com/t/429528
+ https://ericclose.github.io/Pixel-modem-mod-for-China-Telecom.html

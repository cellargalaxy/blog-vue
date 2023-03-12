---
createdAt: '2019-08-23'
updatedAt: '2019-08-23'
---
最近垃圾电信的手机信号差到爆炸，满格的4G等于断网，一格的3G不掉线已经偷笑，所以是不可能通过桌面远程到公司电脑了。鉴于此，打算起了能不能通过ssh远程到windows里，随便模拟一把linux的bash shell环境，减轻网络负担。经过倒腾，目前的方案是windows10自带的openssh+linux子系统方案。

<!--more-->

# windows10开启openssh
在windows10的“设置”里搜索“管理可选功能”。然后就应该有“Openssh 服务器”的选项安装了。安装完成后，由于“Openssh 客户端”是默认安装的，所以可以打开一个命令行，ssh一下本地地址，账号密码是当前用户，端口默认是22。连上即安装完成，不过远程进去的是垃圾windows的命令行环境。
![](/file/blog/code/20190823/20181115152127687.png)

# 安装windows的linux子系统（wsl）
首先在控制面板->程序和功能->启用或关闭Windows功能->勾选 适用于Linux的Windows子系统，然后重启电脑生效
![](/file/blog/code/20190823/723701-20180103223038768-1629438015.png)

重启之后，在windows的应用商城搜索“WSL”，我就装Ubuntu了。随便吐槽一下，他的下载速度虽然显示上M，但还是下载了贼久，大约二百多M下载了半个小时，不知道他的速度是怎样算出来的。

安装完成之后会提醒你启动，第一次启动会弹一个类似命令行的界面，左上角的图标的ubuntu。再略等几分钟，会要求设置ubuntu的账号密码，按照提示设置即可。

# 通过ssh远程Windows的linux环境
wsl安装完成之后，就可以在命令行在执行`bash`命令，即进入ubuntu环境。如果还没安装wsl执行`bash`命令，会提示你还没装wsl，叫你去安装。因此，结合openssh，先远程到windows的命令行界面，执行`bash`命令进入ubuntu环境，就拥有了linux的bash shell环境了。而windows下磁盘，是挂在在`/mnt`下面，即例如C盘挂载在`/mnt/c`下，就可以愉快使用了。

参考文献
[win10 开启ssh服务，远程vim](https://blog.csdn.net/ujsDui/article/details/84105303)
[WSL(Windows Subsystem for Linux)的安装与使用](https://www.cnblogs.com/JettTang/p/8186315.html)
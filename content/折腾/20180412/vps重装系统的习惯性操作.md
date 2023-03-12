---
createdAt: '2018-04-12'
updatedAt: '2018-04-12'
---

<!--more-->

# 更新软件
```shell
yum update -y
```
# 修改ssh端口
```shell
vim /etc/ssh/sshd_config
```
一般这个配置文件里会注释掉`Port 22`，但是最好删掉注释，再加上新的ssh端口，避免万一新端口被占用而不能正常使用，但又注释掉22导致再也连不上的问题。
```
Port 22
Port 123456
```
重启ssh服务
```shell
systemctl restart sshd
```
当确认新端口能登录之后，注释22端口，启动防火墙关闭22端口
# 防火墙
```shell
#永久的开放需要的端口
sudo firewall-cmd --zone=public --add-port=3000/tcp --permanent
sudo firewall-cmd --reload

#检查新的防火墙规则
firewall-cmd --list-all

#临时关闭防火墙,重启后会重新自动打开
systemctl restart firewalld
#检查防火墙状态
firewall-cmd --state
firewall-cmd --list-all
#Disable firewall
systemctl disable firewalld
systemctl stop firewalld
systemctl status firewalld
#Enable firewall
systemctl enable firewalld
systemctl start firewalld
systemctl status firewalld
```
# 下载jdk
http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
```shell
wget -c --no-cookie --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u161-b12/2f38c3b165be4555a1fa6e98c45e0808/jdk-8u161-linux-x64.tar.gz
```
# 下载maven
下载鸡儿慢，挂代理下载完，再上传到vps里比直接下载还快。http://maven.apache.org/download.cgi
```shell
wget -c http://apache.mirror.globo.tech/maven/maven-3/3.5.3/binaries/apache-maven-3.5.3-bin.tar.gz
```
# 配置环境变量
```shell
vim ~/.bashrc
```
```shell
#set oracle jdk environment
export JAVA_HOME=/usr/local/java/jdk1.8.0_161
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH

# set maven environment
export MAVEN_HOME=/usr/local/maven/apache-maven-3.5.3
export PATH=$PATH:${MAVEN_HOME}/bin
```
刷新环境变量
```shell
source ~/.bashrc
```
# 在ps里查看完整的命令
```shell
ps -ef | more
```

参考文献

[怎样修改 CentOS 7 SSH 端口](https://sebastianblade.com/how-to-modify-ssh-port-in-centos7/ "怎样修改 CentOS 7 SSH 端口")

[CentOS 7开放端口和关闭防火墙](https://www.jianshu.com/p/bad33004bb4f "CentOS 7开放端口和关闭防火墙")

[CentOS下用wget命令下载JDK](https://teddysun.com/148.html "CentOS下用wget命令下载JDK")
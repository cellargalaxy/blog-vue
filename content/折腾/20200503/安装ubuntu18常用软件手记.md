---
createdAt: '2020-05-03'
updatedAt: '2020-05-03'
---

<!--more-->

# 更新源
```shell script
sudo cp /etc/apt/sources.list /etc/apt/sources.list.back
sudo vi /etc/apt/sources.list

# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ bionic-proposed main restricted universe multiverse

sudo apt update -y
```

# 输入法
安装
```shell script
sudo apt-get install -y fcitx-bin
sudo apt-get install -y fcitx-table
im-config -n fcitx
reboot

# 谷歌
sudo apt-get install -y fcitx-googlepinyin fcitx-module-cloudpinyin

# 搜狗
sudo dpkg -i 软件包名.deb
sudo apt-get install -f

# 配置输入法
fcitx-config-gtk3
```
候选框乱码
```shell script
# 删除搜狗拼音的配置文件
rm -rf ~/.config/SogouPY ~/.config/sogou*

# 重启fcitx
pidof fcitx
kill pid
fcitx
```

# 谷歌浏览器
略

# N卡驱动
略

# 其他软件
```shell script
sudo apt-get install -y guake
sudo apt install -y mpv
sudo apt-get install -y htop
```

# gnome-tweak
```shell script
sudo apt install -y gnome-tweak-tool
sudo apt-get install chrome-gnome-shell
```

+ 天气：https://extensions.gnome.org/extension/750/openweather/
+ 系统监控：https://extensions.gnome.org/extension/120/system-monitor/
+ 系统监控依赖：`sudo apt install gir1.2-gtop-2.0 gir1.2-nm-1.0 gir1.2-clutter-1.0`
+ 截图：https://extensions.gnome.org/extension/1112/screenshot-tool/
+ N卡监控：https://extensions.gnome.org/extension/1320/nvidia-gpu-stats-tool/
+ 拓展更新https://extensions.gnome.org/extension/1166/extension-update-notifier/

# 字体
```shell script
# 新建一个目录，将字体文件复制到该文件夹下
sudo mkdir -p /usr/share/fonts/win
sudo cp /media/meltsprout/C6BC4A30BC4A1B77/Windows/Fonts/*.ttf /usr/share/fonts/win
sudo cp /media/meltsprout/C6BC4A30BC4A1B77/Windows/Fonts/*.ttc /usr/share/fonts/win

# 在该文件夹下执行
cd /usr/share/fonts/win
sudo chmod -R 644 /usr/share/fonts/win
sudo mkfontscale
sudo mkfontdir
sudo fc-cache -fv

# 重启
reboot
```

# docker
```shell script
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
sudo systemctl enable docker
sudo systemctl start docker
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
sudo docker volume create portainer_data
sudo docker run -d --name portainer --restart=always -p 8000:8000 -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer:latest
```

# 主题
```shell script
sudo apt install -y arc-theme

sudo add-apt-repository ppa:numix/ppa
sudo apt update
sudo apt install -y numix-icon-theme-circle
```

# 设置硬件时间为本地时间
```shell script
sudo hwclock --localtime --systohc

sudo apt-get install ntpdate
sudo ntpdate 0.cn.pool.ntp.org
```
+ 0.cn.pool.ntp.org
+ 1.cn.pool.ntp.org
+ 2.cn.pool.ntp.org
+ 3.cn.pool.ntp.org

# Host
+ https://github.com/oldj/SwitchHosts/blob/master/README_cn.md
+ https://github.com/521xueweihan/GitHub520

# shell
https://github.com/ohmyzsh/ohmyzsh

# grub启动
```shell
sudo vim /etc/default/grub

GRUB_DEFAULT=2
GRUB_TIMEOUT_STYLE=hidden
GRUB_TIMEOUT=3

update-grub
```

# zsh
https://github.com/ohmyzsh/ohmyzsh

字体乱码：https://e99net.github.io/2018/06/07/install_oh-my-zsh_of_ubuntu/
```shell
git clone https://github.com/powerline/fonts
cd ~/fonts
./install.sh
```
然后在配置终端，依次选择“编辑”->“配置文件首选项”，选择“自定义字体”，字体为“Ubuntu Mono derivative Powerline Regular”即可。

# 截图
```shell
sudo apt install flameshot

# 快捷键启动截图
flameshot gui
```

# 微信QQ
```shell
# 微信里的net="host"，本来是为了能进行聊天记录备份。但发现备份会导致卡死
sudo docker run -d \
  --name wechat \
  --device /dev/snd \
  --ipc="host" \
  --net="host" \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -v ~/wechat/WeChatFiles:/WeChatFiles \
  -e DISPLAY=unix$DISPLAY \
  -e XMODIFIERS=@im=fcitx \
  -e QT_IM_MODULE=fcitx \
  -e GTK_IM_MODULE=fcitx \
  -e AUDIO_GID=$(getent group audio | cut -d: -f3) \
  -e GID=$(id -g) \
  -e UID=$(id -u) \
  bestwu/wechat
  
sudo docker run -d \
  --name qq \
  --device /dev/snd \
  --ipc="host" \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -v ~/qq/TencentFiles:/TencentFiles \
  -e DISPLAY=unix$DISPLAY \
  -e XMODIFIERS=@im=fcitx \
  -e QT_IM_MODULE=fcitx \
  -e GTK_IM_MODULE=fcitx \
  -e AUDIO_GID=$(getent group audio | cut -d: -f3) \
  -e VIDEO_GID=$(getent group video | cut -d: -f3) \
  -e GID=$(id -g) \
  -e UID=$(id -u) \
  bestwu/qq:im
```

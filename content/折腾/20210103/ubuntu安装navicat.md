---
createdAt: '2021-01-03'
updatedAt: '2021-01-03'
---

<!--more-->

# 安装依赖
```shell
sudo apt-get install build-essential
sudo apt install libcapstone-dev
sudo apt install cmake
sudo apt install rapidjson-dev
```

# 编译keystone
```shell
git clone https://github.com/keystone-engine/keystone.git
cd keystone
mkdir build
cd build

../make-share.sh
sudo make install
sudo ldconfig
```

# 编译补丁
```shell
git clone -b linux --single-branch https://github.com/HeQuanX/navicat-keygen-tools.git
cd navicat-keygen-tools
make all

# 检查bin目录下是否有navicat-keygen和navicat-patcher
cd bin
ls
```

# 解包官方软件
```shell
# 在navicat-keygen-tools/bin下
# 下载官方navicat15
wget https://www.navicat.com.cn/download/direct-download?product=navicat15-premium-cs.AppImage&location=1

mkdir navicat15
sudo mount -o loop navicat15-premium-cs.AppImage navicat15
cp -r navicat15 navicat15-patched
sudo umount navicat15
```

# 破解
```shell
# 赋予执行权限
chmod +x appimagetool-x86_64.AppImage
chmod +x navicat-patcher
chmod +x navicat-keygen
```

# 运行补丁
```shell
./navicat-patcher navicat15-patched
```

# 打包运行破解后的软件
```shell
./appimagetool-x86_64.AppImage navicat15-patched navicat15-premium-cs-pathed.AppImage
chmod +x navicat15-premium-cs-pathed.AppImage
./navicat15-premium-cs-pathed.AppImage
```
**_然后断网_**

# 运行注册机
```shell
./navicat-keygen --text ./RegPrivateKey.pem

# 根据提示，选择Premium、Simplified Chinese、15……
# 生成序列号
[*] Serial number:
NAVC-PJWW-BKN4-C4YW

# 将注册码贴到navicat里，得到注册码，然后注入注册码
[*] Input request code in Base64: (Double press ENTER to end)
nqKkI0BtJR5Nq***==

# 生成激活码
[*] Request Info:
{"K":"NAVCPJWWBKN4C4YW", "DI":"B0A1C7E8FA226577356B", "P":"linux"}

[*] Response Info:
{"K":"NAVCPJWWBKN4C4YW","DI":"B0A1C7E8FA226577356B","N":"zenghaiming","O":"hh","T":1582448573}

[*] Activation Code:
CKrwYGzMf0OZgZCE***==
```

得到一个注册成功的`navicat15-premium-cs-pathed.AppImage`，拷贝到喜欢的地方使用

# 清理
```shell
rm -rf navicat15
rm -rf navicat15-patched
```

参考文章

[ubuntu 安装 navicat](https://www.rainsheep.cn/articles/2020/08/15/1597469098346.html)

[Ubuntu安装激活Navicat Premium 15](https://www.zze.xyz/archives/ubuntu-navicat.html)

[Ubuntu20.04安装激活Navicat15](https://www.jianshu.com/p/e750b8736311)

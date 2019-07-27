# 简介
一个博客，使用nuxt做服务端渲染，会轮训从指定git仓库里clone/pull作为博文的来源。最终效果达到，在服务器部署好，指定某个git仓库。直接把文章更新到git上，服务端就会更新博文。

# 使用
第一次使用需要先执行`install.sh`，在脚本里会要求输入一些参数，并且在根目录生成一个配置文件`bootConfig.json`。其中脚本要求输入的参数参考如下
```json
{
  "gitUrl": "", //所指定的git仓库url，必填
  "ref": "master", //git的分支，默认master
  "username": "", //如果是私有仓库，需指定账号，否则为空字符串即可
  "password": "", //如果是私有仓库，需指定密码，否则为空字符串即可
  "flushTime": 600000, //每隔多久clone/pull仓库，单位毫秒，默认十分钟
  "repositoryPath": "static/repository" //仓库所clone到的文件地址，最好别改，脚本里也没这选项
}
```

2. `install.sh` 会依次做无件事，生成`bootConfig.json`配置文件，删除`.nuxt`和`node_modules`两个文件夹，安装node依赖，clone仓库，构建nuxt
3. `clone-start.sh` 在后台启动一个更新git仓库的进程，会先停止全部已经在运行的更新git仓库的进程
4. `clone-status.sh` 查看更新git仓库的进程的pid
5. `clone-stop.sh` 停止全部已经在运行的更新git仓库的进程
6. `nuxt-start.sh` 在后台启动nuxt，会先停止全部已经在运行的该项目的nuxt
7. `nuxt-status.sh` 查看该项目的nuxt的进程的pid
8. `nuxt-stop.sh` 停止全部已经在运行的该项目的nuxt

所以第一次使用需要先执行`install.sh`，之后执行`clone-start.sh`和`nuxt-start.sh`两个脚本，日志分别会输出到`clone.log`和`nuxt.log`。

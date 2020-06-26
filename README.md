# 简介
一个博客，每间隔一段时间从指定git仓库里拉取文章，使用nuxt做服务端渲染。最终达到部署服务后，把文章更新到git上，博客就会自动更新博文。

# 本地使用
```bash
cd blog-vue
npm i
bash generate.sh
```
然后依照提示填写信息。`generate.sh`执行到最后，会监听`8080`端口，在浏览器打开`127.0.0.1:8080`即可

# docker安装
```bash
cd blog-vue
npm i
bash install-docker.sh
```
然后依照提示填写信息。`install-docker.sh`执行完成后，还需要一段时间来生成html（大约一分钟到二十分钟）。之后会监听`8080`端口，在浏览器打开`127.0.0.1:8080`即可

# 参数
|参数|默认值|含义|
|-|-|-|
|git url|没有默认值|git的地址|
|git ref|master|git的分支|
|git username|""|git的账号，如果是私有仓库需要填写|
|git password|""|git的密码，如果是私有仓库需要填写|
|sleepTime|3600(秒)|每间隔3600秒拉取一次git的文件进行编译，docker中使用|
|listen port|8888|docker的监听端口|
|container name|blog_vue|docker的容器的名字|

# 文章git结构
参考https://github.com/cellargalaxy/blog-code ，约定`.static`存放静态文件，git目录下有`config.json`作为站点的配置

# Summary
A blog, pull articles from the git repository at interval, use nuxt as server。After deploying the service, push articles to git and blog will auto update.

# local use
```bash
cd blog-vue
npm i
bash generate.sh
```
Fill in the information as prompted. `generate.sh`execution to the end, will listen`8080`port, open`127.0.0.1:8080`in the browser.

# docker install
```bash
cd blog-vue
npm i
bash install-docker.sh
```
Fill in the information as prompted. After`install-docker.sh`execution, it still takes a while to generate the html(About one minute to twenty minutes). will listen`8080`port, open`127.0.0.1:8080`in the browser.

# Parameter
|parameter|defaults|meaning|
|-|-|-|
|git url|no default|git address|
|git ref|master|git branch|
|git username|""|git username, need to fill in if it is private|
|git password|""|git password, need to fill in if it is private|
|sleepTime|3600(second)|pull the git file every 3600 seconds for compilation, use in docker|
|listen port|8888|docker listen port|
|container name|blog_vue|docker container name|

# Article git structure
Reference https://github.com/cellargalaxy/blog-code, promise`.static`Store static files, git path has`config.json`configuration as a site

# 计划
1. ~~修改编译时间的bug~~（已修复）
2. ~~为什么宽会有多~~（已修复）
3. ~~减少无关字段在文章编译时输出~~（已完成）
4. ~~修改文章日期结构为20200121形式~~（已完成）
5. ~~看看叶头的图片需不需要位置的大小更改适配~~（不需要）
6. ~~博客头像固定url~~（已完成）
7. ~~支持stackedit~~（已完成）
8. ~~支持子目录分类型解析，为以后继续挖坑做准备~~（已完成）
9. ~~代码行的多出一行bug~~（已修复）
10. ~~增加评论~~（已完成）
11. 新增一个自定义的文章排序，文章文件名`title.{num}.md`排序数为num，`title.md`默认为0。
  例如`title.-1.md<title.md<title.1.md`。自定义排序优先于日期排序。
12. 标准化url路径名称

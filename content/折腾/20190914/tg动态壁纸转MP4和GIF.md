---
createdAt: '2019-09-14'
updatedAt: '2019-09-14'
---
# 步骤

1. lottie是一种视频格式，数据会保存为一个json，所以lottie文件是一个json文件，可以在进行[https://svgsprite.com/tools/lottie-player/](https://svgsprite.com/tools/lottie-player/)播放。
2. tg的动态壁纸的后缀为`tgs`，官方介绍`tgs`是lottie格式的gzip压缩。
3. `tgs`文件在手机的`/storage/emulated/0/Android/data/org.telegram.messenger/cache`里，虽然后缀为`tgs`，但其实已经解压过，直接是个json文件了可以播放了。
3. 使用[https://github.com/transitive-bullshit/puppeteer-lottie](https://github.com/transitive-bullshit/puppeteer-lottie)，依赖于`gifski`和`ffmpeg`，可以直接装换为mp4或者gif。但是发现最后一帧会有问题，导致视频会闪一闪。
4. 使用puppeteer-lottie对lottie转gif，会在`/tmp`生成一个临时目录，文件夹名字形似一个md5，保存全部帧的png，拷贝出来待用
5. 使用ffmpeg将png压成mp4
6. 使用ffmpeg将mp4压成gif

<!--more-->

# 使用puppeteer-lottie对lottie转gif获取png

目的是获取到png而不是转为gif。所以运行到一定程度就可以control+c了。生成gif不知道为什么会调用chrome，并且生成一个都要非常久，所以异步一口气跑，会很卡。

```js
const renderLottie = require('puppeteer-lottie')
const fs = require('fs')

fs.readdir("/home/home/json",function(err, files){
    files.forEach(function(file){
        renderLottie({
            path: "/home/home/json/"+file,
            output: '/home/home/gif/'+file+'.gif'
        })
    });
});
```

# 使用ffmpeg将png压成mp4

貌似ffmpeg的`-r`是指60帧，fps又好像是指60帧？？？反正压出来貌似还行，不懂ffmpeg怎么用

```shell
#!/usr/bin/env bash

for file_name in `ls /home/home/png`
do
    cd '/home/home/png/'$file_name
    ffmpeg -r 60 -i frame-000000000%03d.png -c:v libx264 -vf fps=60 -pix_fmt yuv420p '/home/home/mp4/'$file_name'.mp4'
done
```

# 使用ffmpeg将mp4压成gif

```shell
#!/usr/bin/env bash

for file_name in `ls /home/home/mp4`
do
    cd '/home/home/mp4/'$file_name
    ffmpeg -i '/home/home/mp4/'$file_name '/home/home/gif/'$file_name.gif
done
```

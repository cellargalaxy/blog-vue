---
createdAt: '2020-04-22'
updatedAt: '2020-04-22'
---
由于对ffmpeg基本一窍不通，所以只能在网上搜索一下别人写好的ffmpeg参数，复制粘贴一下，做个备忘。

<!--more-->

# 将一个视频转为多张图片

+ -vf：为图片添加水印，字体大小15，颜色灰色，时间格式hms
+ -r：每秒取五张截图
+ -q:v：生成的图片质量（好像）
+ -f：输出的图片格式，可忽略

```bash
ffmpeg \
-i "input.mp4" \
-vf "drawtext=fontsize=15:fontcolor=gray:text='%{pts\:hms}'" \
-r 5 \
-q:v 2 \
-f image2 \
"images/%05d.jpeg"
```

# 将一个图片转为视频

这样子视频只有一帧

```bash
ffmpeg -i input.jpg output.mp4
```

+ -r :读取输入文件的时候帧率为25帧每秒
+ -loop：循环读取input文件
+ -vcodec：视频编码为H264（我猜）
+ -s：视频的像素，好像要求高和宽都是偶数
+ -t：视频长度为10秒

```bash
ffmpeg \
-i input.jpg \
-r 25 \
-loop 1 \
-pix_fmt yuv420p \
-vcodec libx264 \
-b:v 600k \
-r:v 25 \
-preset medium \
-crf 30 \
-s 2728x3016 \
-vframes 250 \
-r 25 \
-t 10 \
output.mp4
```

# 转为音频

+ -ac：音轨数量

```bash
ffmpeg -i video.mkv -ac 2 audio.wav
```
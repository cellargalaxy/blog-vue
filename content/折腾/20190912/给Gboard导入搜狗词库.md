---
createdAt: '2019-09-12'
updatedAt: '2019-09-12'
---

<!--more-->

用习惯了搜狗输入法，已用Gboard，感觉Gboard好像智障一样，都识别不出我要的词的。后来才知道Gboard莫得官方词库，是通过记录用户输入，训练常用词，但还真是tmd难用，变打算起把搜狗输入法的词库导入Gboard里。

1. 下载搜狗的词库文件：[https://pinyin.sogou.com/dict/](https://pinyin.sogou.com/dict/)，格式是`scel`。没有必要写个爬虫去抓，如果只把官方推荐的词库下载下来，也就几十个，如果导入的词库多了，Gboard也吃不消。

2. 下载深蓝词库转换器：[https://github.com/studyzy/imewlconverter/releases](https://github.com/studyzy/imewlconverter/releases)，能一次选择多个`scel`文件，其实不需要一个一个文件导入

3. 输出的结果选择【用户自定义短语】，格式是`编码	短语	zh-CN`，中间通tab隔开，最后的`zh-CN`当然就表示简体中文了，如果不知道自己需要的语言的编码，在Gboard里导出个就知道了

4. 转换器保存为一个叫`dictionary.txt`文件，默认的编码格式是【UTF-8有BOM】，需要手动装换为【UTF-8无BOM】

5. 在文件开头加一句注释`# Gboard Dictionary version:1`

6. 将`dictionary.txt`压缩为任意文件名的zip，放到手机里，Gboard就可以选择这个文件进行词库导入了

我下载了115个`scel`，生成的`dictionary.txt`有44M，Gboard导入要好久好久，可能要半个小时。。。

参考文献：

[Gboard词库导入](https://www.jianshu.com/p/00373c2d2bd6)
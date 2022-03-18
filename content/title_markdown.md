---
createdAt: '2020-01-22' updatedAt: '2020-01-23' level: 1
---

### 主要特性

- 支持“标准”Markdown / CommonMark和Github风格的语法，也可变身为代码编辑器；
- 支持实时预览、图片（跨域）上传、预格式文本/代码/表格插入、代码折叠、搜索替换、只读模式、自定义样式主题和多语言语法高亮等功能；
- 支持ToC（Table of Contents）、Emoji表情、Task lists、@链接等Markdown扩展语法；
- 支持TeX科学公式（基于KaTeX）、流程图 Flowchart 和 时序图 Sequence Diagram;
- 支持识别和解析HTML标签，并且支持自定义过滤标签解析，具有可靠的安全性和几乎无限的扩展性；
- 支持 AMD / CMD 模块化加载（支持 Require.js & Sea.js），并且支持自定义扩展插件；
- 兼容主流的浏览器（IE8+）和Zepto.js，且支持iPad等平板设备；
- 支持自定义主题样式；

<!--more-->

# blog-vue

![](https://img.shields.io/github/issues/cellargalaxy/blog-vue) ![](https://img.shields.io/github/forks/cellargalaxy/blog-vue) ![](https://img.shields.io/github/stars/cellargalaxy/blog-vue) ![](https://img.shields.io/github/license/cellargalaxy/blog-vue)

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

This is an H1
=============

This is an H2
-------------

---

+ 列表一
+ 列表二
  - 列表1
  - 列表2
  - 列表3
+ 列表三

1. 第一行
2. 第二行
3. 第三行

- [X]  GFM task list 1
- [X]  GFM task list 2
- [ ]  GFM task list 3
- [ ]  GFM task list 4

|     | 类型一       | 类型二                     |
|-----|-----------|-------------------------|
| 删除线 | ~~删除线~~   | <s>删除线（开启识别HTML标签时）</s> |
| 斜体字 | *斜体字*     | _斜体字_                   |
| 粗体  | **粗体**    | __粗体__                  |
| 粗斜体 | ***粗斜体*** | ___粗斜体___               |

上标：X<sub>2</sub>，下标：O<sup>2</sup>

> 引用：如果想要插入空白换行`即<br />标签`，在插入处先键入两个以上的空格然后回车即可，[普通链接](http://localhost/)。

[普通链接带标题](http://localhost/ "普通链接带标题")

执行命令：`npm install marked`

```javascript
function test() {
  console.log("Hello world!");
}

var testBox = box();
testBox.add("jQuery").remove("jQuery");
```

```html
<!DOCTYPE html>
<html>
<head>
  <mate charest="utf-8"/>
  <title>Hello world!</title>
</head>
<body>
<h1>Hello world!</h1>
</body>
</html>
```

```shell
ls /
cat /proc/mounts
cat /proc/1/maps
apt-get update
apt-get install tcpdump
tcpdump
apt-get install lsof
lsof
```

```css
body {
  background-color: burlywood;
}

.black-background-5 {
  background-color: rgba(0, 0, 0, 0.5);
  border-color: rgba(0, 0, 0, 0.5);
}
```

```go
func main(){
    fmt.Println("go")
}
```

```java
public void main(String[] args){
    System.out.println("Hello World");
}
```

```json
{
  "url": "https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png",
  "description": "wide image",
  "type": "wide"
}
```

```markdown
# Heading 1

[普通链接带标题](http://localhost/ "普通链接带标题")

执行命令：`npm install marked`
```

```sql
SELECT COUNT(*) AS cpt, MAX(t.pos) AS max_pos
FROM `my_table`
LEFT JOIN `other_table` AS t
WHERE `somecol` IS NOT NULL
ORDER BY t.other_col DESC
```

```yaml
product: High Heeled "Ruby" Slippers
description: "Putting on these \"slippers\" is easy."
address:
  city: East Centerville
  street: !!str |
    123 Tornado Alley
    Suite 16
```

![](https://s3.bmp.ovh/imgs/2022/03/0220af6579e287bc.png)
![](https://s3.bmp.ovh/imgs/2022/03/bf7c85bd106c412b.jpg)

![](https://s3.bmp.ovh/imgs/2022/03/667fb45e1ad9d8d2.jpg)




### 科学公式 TeX(KaTeX)

多行公式：

```math
\displaystyle
\left( \sum\_{k=1}^n a\_k b\_k \right)^2
\leq
\left( \sum\_{k=1}^n a\_k^2 \right)
\left( \sum\_{k=1}^n b\_k^2 \right)
```

```katex
\displaystyle 
    \frac{1}{
        \Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{
        \frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {
        1+\frac{e^{-6\pi}}
        {1+\frac{e^{-8\pi}}
         {1+\cdots} }
        } 
    }
```

```latex
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
```

### 绘制流程图 Flowchart

```chart
st=>start: 用户登陆
op=>operation: 登陆操作
cond=>condition: 登陆成功 Yes or No?
e=>end: 进入后台

st->op->cond
cond(yes)->e
cond(no)->op
```

### 绘制序列图 Sequence Diagram

```chart
Andrew->China: Says Hello 
Note right of China: China thinks\nabout it 
China-->Andrew: How are you? 
Andrew->>China: I am good thanks!
```

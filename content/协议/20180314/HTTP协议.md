---
createdAt: '2018-03-14'
updatedAt: '2018-03-14'
---
# URI,URL与HTTP
URI，统一资源标识符，个人理解是一种概念性的东西，即能唯一表示一个资源的都可以叫URI，例如给每个资源起一个唯一的编号。而URL则是URI的一种实现。URL也能唯一定位一个资源。而HTTP又是URL的一种实现。

http是基于TCP/IP协议的，应用层的，无连接无状态的协议。

<!--more-->

# HTTP请求方法
在HTTP1.1版协议中，HTTP请求方法有八种。
```
GET      请求指定的页面信息，并返回实体主体
HEAD     类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头
POST     向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改
PUT      从客户端向服务器传送的数据取代指定的文档的内容
DELETE   请求服务器删除指定的页面
CONNECT  HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器
OPTIONS  允许客户端查看服务器的性能
TRACE    回显服务器收到的请求，主要用于测试或诊断
```

# HTTP请求报文
HTTP请求报文分四个部分组成：请求行，请求头，空行，请求体。
![](/file/blog/code/20180314/upload-images.jianshu.io-upload_images-2964446-fdfb1a8fce8de946.png.1.png)
## GET请求方法的请求报文
```
GET /?sex=man&name=Professional HTTP/1.1
Host:www.example.com
User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36

```
请求行是第一行，又三部分组成。第一部分是请求方法`GET`，第二部分是URL`/?sex=man&name=Professional`，第三部分是协议版本`HTTP/1.1`。三部分之间用空格间隔。

接下来是请求头，请求头以`key:value`结构组成。请求头存在的目的是浏览器给服务器提供一些协议里没有定义，但又不是需要传输的数据的额外的信息。这里如请求的目的地址`www.example.com`，系统是`Windows NT 10.0`，浏览器是`Chrome`之类的。

第三部分是空行，用于把请求头与请求体分割开。即使请求体为空，这一空行任然要存在。

第四部分是请求体，可以为任意类型的数据。每一行之间都已回车换行符`\r\n`分割。

## POST请求方法的请求报文
```
POST / HTTP/1.1
Host:www.example.com
User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36
Content-Type:application/x-www-form-urlencoded
Content-Length:40

sex=man&name=Professional
```
HTTP协议规定POST提交的数据都要在请求体里。由于请求体可以是任意编码数据，所以为了服务器能以正确的方式解析这些数据，会在请求头添加一个`Content-Type`来告诉服务器请求体的数据编码。这里的`application/x-www-form-urlencoded`是最常见的，浏览器默认的表单数据编码类型。而`multipart/form-data`则是二进制编码。一个二进制编码的POST请求报文：
```
POST / HTTP/1.1
Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA

------WebKitFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data; name="sex"

man
------WebKitFormBoundaryrGKCBY7qhFd3TrwA
Content-Disposition: form-data; name="file"; filename="chrome.png"
Content-Type: image/png

PNG ... content of chrome.png ...
------WebKitFormBoundaryrGKCBY7qhFd3TrwA--
```
这里提交了一个sex为man的数据，以及一个参数名为file，文件名为chrome.png的图片。我们看到`Content-Type`后面除了指定了`:multipart/form-data`，表明是二进制数据以外，还有一个`boundary`值为`----WebKitFormBoundaryrGKCBY7qhFd3TrwA`。这个`----WebKitFormBoundaryrGKCBY7qhFd3TrwA`用于将请求体分割开几个部分，各部分是一个参数。例如请求体第一部分，`Content-Disposition`说他说表单数据，参数名叫sex，值在空一个空行之后为man。

# HTTP响应报文
HTTP响应报文也是由四部分组成：状态行，响应头，空行，响应体
```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Content-Length: 137582
Expires: Thu, 05 Dec 1997 16:00:00 GMT
Last-Modified: Wed, 5 August 1996 15:55:28 GMT
Server: Apache 0.84

<html>
  <body>Hello World</body>
</html>
```
状态行是第一行，由三个部分组成，每部分之间用空格隔开。第一部分是协议版本，第二部分是状态码，第三部分是状态消息。

之后是响应头，作用跟请求头一样，只不过变成服务器告诉浏览器的一些额外信息。如表明响应体的文本类型，长度137582，时间等等

第三部分是空行，即使响应体为空依然需要存在

第四部分是响应体，数据编码任意

## HTTP状态码
HTTP状态码分为五类
```
1xx：指示信息--表示请求已接收，继续处理
2xx：成功--表示请求已被成功接收、理解、接受
3xx：重定向--要完成请求必须进行更进一步的操作
4xx：客户端错误--请求有语法错误或请求无法实现
5xx：服务器端错误--服务器未能实现合法的请求
```
常见HTTP状态码
```
200 OK                        客户端请求成功
400 Bad Request               客户端请求有语法错误，不能被服务器所理解
401 Unauthorized              请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用
403 Forbidden                 服务器收到请求，但是拒绝提供服务
404 Not Found                 请求资源不存在，eg：输入了错误的URL
500 Internal Server Error     服务器发生不可预期的错误
503 Server Unavailable        服务器当前不能处理客户端的请求，一段时间后可能恢复正常
```

## MIME type
响应头的`Content-Type`的值是MIME type，用来表明响应体的数据类型。MIME type可以自定义，只有服务器能识别并解析，一些常见的MIME type：
```
text/plain
text/html
text/css
image/jpeg
image/png
image/svg+xml
audio/mp4
video/mp4
application/javascript
application/pdf
application/zip
application/atom+xml
```

# HTTP协议版本的发展
最早的HTTP/0.9发表于1991年，只有GET方法，返回的也一定要是html。

1996年5月发布了HTTP/1.0，增加了POST和HEAD方法。增加了头信息，状态码之类的。但其缺点是每个TCP连接只能做一次HTTP请求，erTCP建立成本大，性能差。为了是一个TCP连接能请求多个HTTP，会有些非规范做法，在请求头里添加`Connection: keep-alive`，告诉服务器不要关闭TCP连接。

1997年1月发布HTTP/1.1版本，此版本沿用至今。HTTP/1.1默认TCP连接不关闭，需要关闭时在头里添加`Connection: close`。还引入管道机制，使得客户端能同时发送多个请求，服务器对多个请求依次回应，提高效率。

参考文献

[关于HTTP协议，一篇就够了](https://www.jianshu.com/p/80e25cb1d81a "关于HTTP协议，一篇就够了")

[https://hit-alibaba.github.io/interview/basic/network/HTTP.html](https://hit-alibaba.github.io/interview/basic/network/HTTP.html)

[HTTP 协议入门](http://www.ruanyifeng.com/blog/2016/08/http.html "HTTP 协议入门")
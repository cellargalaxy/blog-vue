---
createdAt: '2018-08-02'
updatedAt: '2018-08-02'
---
# 何为域
这里的域指的并不是域名，而是协议、主机地址和端口的唯一组合，即协议，主机地址和端口其中一个不一样那就是另外一个域了。

# 跨域问题为何而来
浏览器为了安全，避免网页被嵌入恶意代码，限制来源于某个域的脚本只能向其来源的域发起ajax请求，并且脚本也无法获取别的域的cookie，DOM等资源，这个叫同源策略。例如我在`http://www.alipay.com/`里嵌入了个检测你支付宝密码的脚本，发现你输入密码，就把你的密码发送到我的域名下，但由于我的域名跟阿里的域名不在同一个域里面，这样子偷偷发送密码的请求就会被浏览器拦截住。

接下来以来源于a.com域（简称a域）的脚本向b.com（简称b域）发起请求作为情景来解释

<!--more-->

# JSONP
同源策略只是限制了a域的脚本不能向b域域发起ajax请求，但是实际上，a域的html还是可以加载其他域的资源。例如`<script>`标签等，就可以加载他域资源。因此，利用这个“漏洞”，a域的脚本往dom里插入一个`<script>`标签，标签的src的链接是b域的，url还需要带上一个回调函数的名字，例如`http://b.com?callback=handleCallback`，这样b域的服务器返回一个js文件，这个js包含参数指定的那个回调函数的方法，方法里包含的不是业务逻辑，而是数据。所以等这个js文件加载完，a域的js调用一下这个函数，就能获取到来源于b域的数据。这种办法就叫做jsonp（不知道跟json有啥关系）。但显然，这种方法只能使用get方法，有很大的局限性。

# CORS
CORS能解决跨域请求问题，其全称为跨域资源共享（Cross-origin resource sharing），是W3C推荐的解决跨域问题的一个标准。CORS需要服务器和浏览器同时支持才行，而浏览器几乎都是已经支持的。浏览器对跨域的请求分了两类，简单请求和非简单请求，对这两种请求浏览器和服务器的处理策略都不一样。

# 简单请求
简单请求的标准是：

1. 请求方法是`HEAD`、`GET`和`POST`其中一种
2. 头信息不超出`Accept`、`Accept-Language`、`Content-Language`、`Last-Event-ID`、`Content-Type`这几个字段
3. 头`Content-Type`的值只能取`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`之一

## 简单请求的请求
对于简单请求。浏览器会在请求头里加个Origin字段，用来表明这次请求是来自于a域的js发起的，包含协议、主机地址和端口
```
GET /cors HTTP/1.1
Origin: http://a.com
Host: b.com...
```
## 简单请求的响应
服务器收到这个请求之后，发现有Origin字段，就会判断接不接受来自于a域的js发起的这个请求。如果服务器接受这次请求，会在正常、普通、200的响应上加上几个头用来标识自己接受这个跨域请求，添加的头为：
```
Access-Control-Allow-Origin: http://a.com
必须，表示此域的跨域访问，*号代表接受任何的域进行跨域访问，但只能指定一个域

Access-Control-Allow-Credentials: true
可选，表示服务器是否接收a域的cookie，只能取值为true，如果想false，删掉这个字段就行

Access-Control-Expose-Headers: X-Custom-Header
可选，浏览器接收到响应后，默认XMLHttpRequest对象的getResponseHeader()方法只能拿到Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma六个字段。如果想他能获取到非默认的X-Custom-Header字段，就要添加在这里
```
如果不接受，则返回一个正常、普通、200的响应。浏览器发现响应没有响应没有上面这些头字段，就知道服务器不接受这次请求，就会报错了。
Access-Control-Allow-Credentials字段只是表示服务器能接收cookie，但是浏览器不一定会发送，为了指明浏览器跨域发送cookie，可以设置`new XMLHttpRequest().withCredentials=true`。

# 非简单请求
不是简单请求的请求都是非简单请求了，例如要使用put，delete方法，或者Content-Type字段为application/json。对于非简单请求，浏览器会先发送一个请求，叫做预检请求，这个预检请求的目的是向服务器确定能否发送这个跨域请求，因此这个请求由浏览器控制，是不在页面代码控制范围里的。浏览器得到服务器确认之后才会发起实际的请求。

## 预检请求的请求
预检请求是个OPTIONS请求，他会在头里带上几个字段来询问服务器是否接受这种跨域请求
```
OPTIONS /cors HTTP/1.1
Origin: http://a.com    来自于这个域的脚本
Access-Control-Request-Method: PUT    想向你发起一个put请求
Access-Control-Request-Headers: X-Custom-Header    还会带上这些头信息
Host: b.com
```
## 预检请求的回应
如果浏览器接受这种跨域请求，就会加几个头字段来表示自己接受
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://a.com    我接受来自于a域的跨域请求，*表示接受任意域
Access-Control-Allow-Methods: GET, POST, PUT    请求的方法我接受这些
Access-Control-Allow-Headers: X-Custom-Header    请求的头也可以带上这些
Access-Control-Allow-Credentials: true    这个跨域我接受cookie
Access-Control-Max-Age: 1728000    并且这之后这么久之内我都是同样的答复的
```
如果浏览器拒绝，就会返回一个正常、普通、200的响应，浏览器发现没有上门这些头字段，就会知道服务器拒绝了这个跨域请求。

## 实际请求的请求
浏览器在预检请求里知道服务器接受跨域请求之后，就会发起实际的请求。在实际请求的请求里，依然会加上Origin来表示是哪个域的脚本发起这次请求的
```
PUT /cors HTTP/1.1
Origin: http://a.com
Host: b.com
X-Custom-Header: value
```

## 实际请求的响应
浏览器也会加上Access-Control-Allow-Origin来表示自己接受那些域的跨域访问
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://a.com
```

参考文献：

[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html "跨域资源共享 CORS 详解")

[跨域资源共享CORS总结](https://www.jianshu.com/p/52bf8f5b8432 "跨域资源共享CORS总结")

[跨域请求之 JSONP 和 CORS](https://isudox.com/2016/09/24/cross-site-jsonp-and-cors/ "跨域请求之 JSONP 和 CORS")
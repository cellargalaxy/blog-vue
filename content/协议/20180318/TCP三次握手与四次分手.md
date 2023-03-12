---
createdAt: '2018-03-18'
updatedAt: '2018-03-18'
---

<!--more-->

学完计算机网络之后再次看TCP的握手和分手，突然悟到了一种对为什么握手要三次，分手要四次的通俗解释。首先，TCP是要确保连接正常的。对于任意一方，则是确保对方是正常的。一方要测试另一方正常，需要一个应答来确认，一应一答为两次。既然TCP双方都需要确认对方正常，那至少要四次握手。但是在在第一次应答的答中，除了回答之外还可以顺便提出请求，所以合并了成了三次握手。同样分手也要四次，但是这四次不能合并，因为两次应答之间可能还有数据需要传输，所以分手是四次。

# TCP报文段首部
1. 序号：这个报文发送的数据的第一个数据，在整个TCP连接中的序号
2. 确认号：你下次可以发送序号开始n+1的数据，言下之意就是序号小于n的数据我都收到了
3. ACK：有两个取值：0和1。为1的时候表示应答域有效，反之为0
4. SYN：表示同步序号，用来建立连接。SYN=1的报文不能传输数据，但是消耗一个序号
5. FIN：为1时表示报文发送方以及没有数据要传输，要断开连接，消耗一个序号

![](https://camo.githubusercontent.com/78f58951bb9ea91fb68d5cb85e4b0136d997cdbd/687474703a2f2f696d672e6d792e6373646e2e6e65742f75706c6f6164732f3230313231302f32332f313335303938343238335f353835372e6a7067)

# TCP三次握手
![](/file/blog/code/20180314/upload-images.jianshu.io-upload_images-2964446-fdfb1a8fce8de946.png.1.png)

1. 首先服务器处于监听状态。客户端发送第一个报文，seq=x。因为是刚要建立连接，所以ack不知道，SYN=1。这是客户端进入SYN_SEND状态。
![](/file/blog/code/20180318/www.centos.bz-wp-content-uploads-2012-08-100327002911.png.1.png)
2. 服务器收到报文要建立连接。seq=y，ack=x+1，SYN=1，ACK=1。服务器进入SYN_RECV状态。
![](/file/blog/code/20180318/www.centos.bz-wp-content-uploads-2012-08-100327003054.png.1.png)
3. 客户端收到服务端的确认，进入ESTABLISHED状态。然后发送seq=x+1（SNY消耗一个序号），ack=y+1，ACK=1的报文
![](/file/blog/code/20180318/www.centos.bz-wp-content-uploads-2012-08-100327003214.png.1.png)
4. 服务器收到之后，也进入ESTABLISHED状态，三次握手完成之后数据传输的报文ACK都为1。

# TCP四次分手
![](/file/blog/code/20180318/upload-images.jianshu.io-upload_images-1641067-5ed8bf6c24244b4c.png.1.png)

1. A方提出分手：发送seq=u，FIN=1的报文。A进入FIN_WAIT_1状态，FIN_WAIT_1状态等的是B确认自己发送的FIN报文
2. B收到FIN报文，立即回复A自己已经收到A的FIN报文，发送seq=v，ack=u+1，ACK=1，B进入CLOSE_WAIT状态。
3. A收到B的确定报文，A进入FIN_WAIT_2状态，FIN_WAIT_2状态是等待B把他还没传输完的数据传输完。
4. B在CLOSE_WAIT状态下垂死挣扎，把还没传输完的数据传输给A。
5. B的数据也传输完了，发送seq=w，ack=u+1（CLOSE_WAIT传输过数据），ACK=1，FIN=1的报文，B进入LAST_ACK状态，等待A确认自己的FIN报文。
6. A收到B的FIN报文，发送seq=u+1（FIN消耗一个序号），ack=w+1，ACK=1的确认报文，A进入TIME_WAIT状态。
7. B收到A的确认，B自己关闭，如果收不到A的确认，再次发送FIN报文
8. A在TIME_WAIT状态下会等待2个MSL时间，等待B的报文。按道理，如果B收到A的报文就关闭了，A在这2个MSL时间里是收不到B的报文的，证明B真的关闭了，如果B没关闭，A就会在这2个MSL时间里收到B的报文。

参考文献：

[通俗大白话来理解TCP协议的三次握手和四次分手](https://github.com/jawil/blog/issues/14 "通俗大白话来理解TCP协议的三次握手和四次分手")

[TCP三次握手四次挥手详解](https://www.cnblogs.com/zmlctt/p/3690998.html "TCP三次握手四次挥手详解")

[图解TCP协议中的三次握手和四次挥手](https://www.jianshu.com/p/9968b16b607e "图解TCP协议中的三次握手和四次挥手")
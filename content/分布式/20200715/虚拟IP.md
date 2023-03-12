---
createdAt: '2020-07-15'
updatedAt: '2020-07-15'
---

<!--more-->

在TCP/IP架构里，IP是逻辑地址，MAC是物理地址，这之间通过ARP地址转换协议进行映射。
ARP协议简单的说就是在局域网里发广播，询问哪台设备持有此IP，并且告知一下MAC。
因此，MAC是与某一硬件网卡所绑定的，而IP则不必。
所以虚拟IP则是一个没有分配到具体网卡的IP，其高可用流程如下：

1. 有服务器A和服务器B，现在服务器A是主服务器
2. 有数据请求到虚拟IP，路由器通过地址转换协议询问虚拟IP对应的MAC，服务器A应答，因此虚拟IP指向服务器A
3. 当服务器B监控服务器A，或者服务器A会向服务器B发送心跳
4. 服务器B发现服务器A宕机，服务器B则请求路由器，让路由器的虚拟IP映射为自己的MAC，完成虚拟IP的映射切换

实际上，可以使用Keepalived这个软件来实现虚拟IP的高可用方案。

参考文章：

[虚拟IP和IP漂移](http://xiaobaoqiu.github.io/blog/2015/04/02/xu-ni-iphe-ippiao-yi/)

[虚拟IP原理及使用](https://www.cnblogs.com/jmcui/p/13055283.html)

[虚拟IP技术](http://www.xumenger.com/virtual-ip-20190220/)
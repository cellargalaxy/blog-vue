---
createdAt: '2018-05-09'
updatedAt: '2018-05-09'
---

简单明了入门Netty，还是看官方文档来的好：[Netty.docs: User guide for 4.x](https://netty.io/wiki/user-guide-for-4.x.html "Netty.docs: User guide for 4.x")。接下来是我看我这篇文档之后的加工，想看的深一点可以看[Netty的那点事儿](https://sylvanassun.github.io/2017/11/30/2017-11-30-netty_introduction/ "Netty的那点事儿")。最好是有些NIO的概念和基础。依照官方文档进行改进，下面代码是要实现一个时间服务器。功能为客户端连接到服务端时，服务端主动发送一个long时间戳给客户端，客户端收到这个时间后打印出来。并且客户端向服务端发送自己的long时间戳后关闭连接，服务器打印收到客户端的时间后也关闭连接。

<!--more-->

# ChannelInboundHandlerAdapter与ChannelOutboundHandlerAdapter
对于一个连接，数据的收发就是对于入站和出站。对于入站和出站，有不同的两个类进行逻辑处理：ChannelInboundHandlerAdapter与ChannelOutboundHandlerAdapter。一般而言，一个连接来了，就会创建一个ChannelInboundHandlerAdapter和ChannelOutboundHandlerAdapter对象，连接的创建，接收数据，发送数据，断开等整个生命周期都会调用ChannelInboundHandlerAdapter和ChannelOutboundHandlerAdapter对于的方法。就像servlet的init，servire和destroy方法那样。
```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.*;

import java.util.Date;

/**
 * Created by cellargalaxy on 18-5-9.
 */
public class TimeClientInboundHandlerAdapter extends ChannelInboundHandlerAdapter {
    public TimeClientInboundHandlerAdapter() {
        super();
        System.out.println("调用:" + hashCode() + ": TimeClientInboundHandlerAdapter()");
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeClientInboundHandlerAdapter.channelRead()");
//        ByteBuf byteBuf = (ByteBuf) msg;//如果没有TimeDecoder这个先前处理，则直接转型为ByteBuf
//        try {
//            long ll = byteBuf.readLong();
//            System.out.println("发来的时间: " + new Date(ll));
//        } finally {
//            byteBuf.release();//在ByteBuf读操作之后，据说是个重要的操作，要在finally里确保执行
//        }

        Time time = (Time) msg;//如果有TimeDecoder这个先前处理，就可以直接转型为Time了
        System.out.println("发来的时间: " + time.createDate());

        ByteBuf byteBuf = ctx.alloc().buffer(8);//创建一个ByteBuf，大小为8个字节，装下一个long
        byteBuf.writeLong(new Date().getTime());//往byteBuf写数据
        //往管道(?)里写数据。可以用ctx.write(Object)和ctx.flush()代替
        //ctx.write(Object)并不会往管道里写数据，而是只是把数据存放在缓存里，所以需要ctx.flush()
        //当然由于是非阻塞IO，这个方法执行后不代表数据已经发送，所以返回一个ChannelFuture对象
        ChannelFuture channelFuture = ctx.writeAndFlush(byteBuf);
        //给channelFuture添加一个监听器，当数据发送完成就关闭管道
        channelFuture.addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture channelFuture) throws Exception {
                ctx.close();
            }
        });
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeClientInboundHandlerAdapter.exceptionCaught()");
        ctx.close();//发送异常就关闭管道
        cause.printStackTrace();//打印异常
    }
    //。。。
}
```
```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.*;

import java.util.Date;

/**
 * Created by cellargalaxy on 18-5-9.
 */
public class TimeServerInboundHandlerAdapter extends ChannelInboundHandlerAdapter {
    public TimeServerInboundHandlerAdapter() {
        super();
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter()");
    }

    //当channel处于活动状态（连接到远程节点）被调用
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.channelActive()");
        ByteBuf byteBuf = ctx.alloc().buffer(8);
        byteBuf.writeLong(new Date().getTime());
        ChannelFuture channelFuture = ctx.writeAndFlush(byteBuf);
    }

    //当处理过程中发生异常时被调用
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.exceptionCaught()");
        ctx.close();
        cause.printStackTrace();
    }

    //该方法不允许将此ChannelHandler共享复用
    @Override
    public boolean isSharable() {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.isSharable()");
        return super.isSharable();
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.handlerAdded()");
        super.handlerAdded(ctx);
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.handlerRemoved()");
        super.handlerRemoved(ctx);
    }

    //当channel被注册到EventLoop时被调用
    @Override
    public void channelRegistered(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.channelRegistered()");
        super.channelRegistered(ctx);
    }

    //当channel已经被创建，但还未注册到EventLoop（或者从EventLoop中注销）被调用
    @Override
    public void channelUnregistered(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.channelUnregistered()");
        super.channelUnregistered(ctx);
    }

    //当channel处于非活动状态（没有连接到远程节点）被调用
    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.channelInactive()");
        super.channelInactive(ctx);
    }

    //当从channel读取数据时被调用
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.channelRead()");
        Time time = (Time) msg;
        System.out.println("发来的时间: " + time.createDate());
        ctx.close();
    }

    //当channel的上一个读操作完成时被调用
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.channelReadComplete()");
        super.channelReadComplete(ctx);
    }

    //当ChannelInboundHandler.fireUserEventTriggered()方法被调用时被调用
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.userEventTriggered()");
        super.userEventTriggered(ctx, evt);
    }

    //当channel的可写状态发生改变时被调用
    @Override
    public void channelWritabilityChanged(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.channelWritabilityChanged()");
        super.channelWritabilityChanged(ctx);
    }

    @Override
    protected void ensureNotSharable() {
        System.out.println("调用:" + hashCode() + ": TimeServerInboundHandlerAdapter.ensureNotSharable()");
        super.ensureNotSharable();
    }
}
```
```java
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelOutboundHandlerAdapter;
import io.netty.channel.ChannelPromise;

import java.net.SocketAddress;

/**
 * Created by cellargalaxy on 18-5-9.
 */
public class TimeServerOutboundHandlerAdapter extends ChannelOutboundHandlerAdapter {
    public TimeServerOutboundHandlerAdapter() {
        super();
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter()");
    }

    //当请求将Channel绑定到一个地址时被调用
    //ChannelPromise是ChannelFuture的一个子接口，定义了如setSuccess(),setFailure()等方法
    @Override
    public void bind(ChannelHandlerContext ctx, SocketAddress localAddress, ChannelPromise promise) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.bind()");
        super.bind(ctx, localAddress, promise);
    }

    //当请求将Channel连接到远程节点时被调用
    @Override
    public void connect(ChannelHandlerContext ctx, SocketAddress remoteAddress, SocketAddress localAddress, ChannelPromise promise) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.connect()");
        super.connect(ctx, remoteAddress, localAddress, promise);
    }

    //当请求将Channel从远程节点断开时被调用
    @Override
    public void disconnect(ChannelHandlerContext ctx, ChannelPromise promise) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.disconnect()");
        super.disconnect(ctx, promise);
    }

    //当请求关闭Channel时被调用
    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise promise) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.close()");
        super.close(ctx, promise);
    }

    //当请求将Channel从它的EventLoop中注销时被调用
    @Override
    public void deregister(ChannelHandlerContext ctx, ChannelPromise promise) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.deregister()");
        super.deregister(ctx, promise);
    }

    //当请求从Channel读取数据时被调用
    @Override
    public void read(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.read()");
        super.read(ctx);
    }

    //当请求通过Channel将数据写到远程节点时被调用
    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.write()");
        super.write(ctx, msg, promise);
    }

    //当请求通过Channel将缓冲中的数据冲刷到远程节点时被调用
    @Override
    public void flush(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.flush()");
        super.flush(ctx);
    }

    @Override
    protected void ensureNotSharable() {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.ensureNotSharable()");
        super.ensureNotSharable();
    }

    //该方法不允许将此ChannelHandler共享复用
    @Override
    public boolean isSharable() {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.isSharable()");
        return super.isSharable();
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.handlerAdded()");
        super.handlerAdded(ctx);
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.handlerRemoved()");
        super.handlerRemoved(ctx);
    }

    //当处理过程中发生异常时被调用
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        System.out.println("调用:" + hashCode() + ": TimeServerOutboundHandlerAdapter.exceptionCaught()");
        super.exceptionCaught(ctx, cause);
    }
}
```

# ByteToMessageDecoder
上文中的TimeDecoder是啥呢？TimeDecoder类是自定义的，继承于ByteToMessageDecoder。他有个decode方法，可以用来凑够指定数量的数据才进行返回。这里要凑够long的8byte。也可以自定义返回的对象，new了一个Time对象。这样子，之后的其他操作都可以获取这个new出来的Time对象进行再加个，有利于代码的编写。
```java
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;

import java.util.List;

/**
 * Created by cellargalaxy on 18-5-9.
 */
public class TimeDecoder extends ByteToMessageDecoder {
    @Override
    protected void decode(ChannelHandlerContext channelHandlerContext, ByteBuf byteBuf, List<Object> list) throws Exception {
        if (byteBuf.readableBytes() < 8) {//不够8个字节时直接返回
            return;
        }
        list.add(new Time(byteBuf.readLong()));//够8个字节就new一个Time
    }
}
```

# EventLoopGroup与ServerBootstrap,Bootstrap
EventLoopGroup是用来处理IO操作的多线程时间循环，应该可以简单而又错误地理解为是个专门用来处理IO的线程池。EventLoopGroup貌似有不同的实现，这里的实现是NioEventLoopGroup。EventLoopGroup通常有两个，一个一般叫boss，用来接受传入的连接。另外一个叫worker，用来处理接受连接的流量。EventLoopGroup使用多少个线程以及它们如何映射到创建的Channels取决于EventLoopGroup实现，或者通过构造函数配置。ServerBootstrap和Bootstrap个人理解是netty的主类了，这个配置模块都是在这个类的进行配置和构建。
```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.util.concurrent.Future;

/**
 * Created by cellargalaxy on 18-5-9.
 */
public class TimeServer {
    public static void main(String[] args) throws InterruptedException {
        //用于处理连接的接收
        EventLoopGroup boss = new NioEventLoopGroup();
        //用于处理连接数据的收发
        EventLoopGroup worker = new NioEventLoopGroup();
        try {
            //主类，服务端的是ServerBootstrap
            ServerBootstrap serverBootstrap = new ServerBootstrap();
            //设置两个EventLoopGroup
            serverBootstrap.group(boss, worker);
            //所创建的隧道为NioServerSocketChannel，实现ServerSocketChannel接口
            serverBootstrap.channel(NioServerSocketChannel.class);
            //ServerSocketChannel的最大连接数
            serverBootstrap.option(ChannelOption.SO_BACKLOG, 16);
            //ServerSocketChannel接收的SocketChannel是长连接
            serverBootstrap.childOption(ChannelOption.SO_KEEPALIVE, true);
            //ServerSocketChannel接收的SocketChannel的初始化操作
            serverBootstrap.childHandler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel socketChannel) throws Exception {
                    //我们的初始化操作是给这个SocketChannel添加Handler，下面添加的Handler是有一定顺序的
                    socketChannel.pipeline().addLast(
                            new TimeDecoder(), //先把数据转变的Time
                            new TimeServerInboundHandlerAdapter(), //再处理Time
                            new TimeServerOutboundHandlerAdapter());
                }
            });
            //绑定端口
            ChannelFuture channelFuture = serverBootstrap.bind(3210).sync();
            //这个不懂什么意思
            channelFuture.channel().closeFuture().sync();
        } finally {//关闭EventLoopGroup
            Future bossFuture = boss.shutdownGracefully();
            Future workerFuture = worker.shutdownGracefully();
        }
    }
}
```
```java
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.concurrent.Future;

/**
 * Created by cellargalaxy on 18-5-9.
 */
public class TimeClient {
    public static void main(String[] args) throws InterruptedException {
        EventLoopGroup eventLoopGroup = new NioEventLoopGroup();
        try {
            //主类，客户端的是Bootstrap
            Bootstrap bootstrap = new Bootstrap();
            //设置EventLoopGroup，这时候boss和worker都是同一个EventLoopGroup
            bootstrap.group(eventLoopGroup);
            //创建的隧道是NioSocketChannel，实现SocketChannel接口
            bootstrap.channel(NioSocketChannel.class);
            //长连接
            bootstrap.option(ChannelOption.SO_KEEPALIVE, true);
            //创建的SocketChannel的初始化操作
            bootstrap.handler(new ChannelInitializer<SocketChannel>() {
                @Override
                protected void initChannel(SocketChannel socketChannel) throws Exception {
                    //我们的初始化操作是给这个SocketChannel添加Handler，下面添加的Handler是有一定顺序的
                    socketChannel.pipeline().addLast(
                            new TimeDecoder(), //先把数据转变的Time
                            new TimeClientInboundHandlerAdapter(), //再处理Time
                            new TimeClientOutboundHandlerAdapter());
                }
            });
            //连接到某个地址
            ChannelFuture channelFuture = bootstrap.connect("127.0.0.1", 3210).sync();
            //这个不懂什么意思
            channelFuture.channel().closeFuture().sync();
        } finally {//关闭EventLoopGroup
            Future future = eventLoopGroup.shutdownGracefully();
        }
    }
}
```

# 执行结果
可以看到，无论是服务端还是客户端（客户端启动了两次，那当然。。。），每次请求都是由新的一个InboundHandlerAdapter对象和OutboundHandlerAdapter对象来处理，所以没有线程安全问题。也可以通过方法的调用顺序看到Handler的整个生命周期。
```
//client第一次调用
调用:2062627650: TimeClientInboundHandlerAdapter()
调用:722555141: TimeClientOutboundHandlerAdapter()
调用:2062627650: TimeClientInboundHandlerAdapter.isSharable()
调用:2062627650: TimeClientInboundHandlerAdapter.handlerAdded()
调用:722555141: TimeClientOutboundHandlerAdapter.isSharable()
调用:722555141: TimeClientOutboundHandlerAdapter.handlerAdded()
调用:2062627650: TimeClientInboundHandlerAdapter.channelRegistered()
调用:722555141: TimeClientOutboundHandlerAdapter.connect()
调用:2062627650: TimeClientInboundHandlerAdapter.channelActive()
调用:722555141: TimeClientOutboundHandlerAdapter.read()
调用:2062627650: TimeClientInboundHandlerAdapter.channelRead()
发来的时间: Thu May 10 20:52:44 CST 2018
调用:2062627650: TimeClientInboundHandlerAdapter.channelReadComplete()
调用:722555141: TimeClientOutboundHandlerAdapter.read()
调用:2062627650: TimeClientInboundHandlerAdapter.channelInactive()
调用:2062627650: TimeClientInboundHandlerAdapter.channelUnregistered()
调用:722555141: TimeClientOutboundHandlerAdapter.handlerRemoved()
调用:2062627650: TimeClientInboundHandlerAdapter.handlerRemoved()
//client第二次调用
调用:249117821: TimeClientInboundHandlerAdapter()
调用:2069507644: TimeClientOutboundHandlerAdapter()
调用:249117821: TimeClientInboundHandlerAdapter.isSharable()
调用:249117821: TimeClientInboundHandlerAdapter.handlerAdded()
调用:2069507644: TimeClientOutboundHandlerAdapter.isSharable()
调用:2069507644: TimeClientOutboundHandlerAdapter.handlerAdded()
调用:249117821: TimeClientInboundHandlerAdapter.channelRegistered()
调用:2069507644: TimeClientOutboundHandlerAdapter.connect()
调用:249117821: TimeClientInboundHandlerAdapter.channelActive()
调用:2069507644: TimeClientOutboundHandlerAdapter.read()
调用:249117821: TimeClientInboundHandlerAdapter.channelRead()
发来的时间: Thu May 10 20:53:23 CST 2018
调用:249117821: TimeClientInboundHandlerAdapter.channelReadComplete()
调用:2069507644: TimeClientOutboundHandlerAdapter.read()
调用:249117821: TimeClientInboundHandlerAdapter.channelInactive()
调用:249117821: TimeClientInboundHandlerAdapter.channelUnregistered()
调用:2069507644: TimeClientOutboundHandlerAdapter.handlerRemoved()
调用:249117821: TimeClientInboundHandlerAdapter.handlerRemoved()
//server的调用
调用:1387686440: TimeServerInboundHandlerAdapter()
调用:384931250: TimeServerOutboundHandlerAdapter()
调用:1387686440: TimeServerInboundHandlerAdapter.isSharable()
调用:1387686440: TimeServerInboundHandlerAdapter.handlerAdded()
调用:384931250: TimeServerOutboundHandlerAdapter.isSharable()
调用:384931250: TimeServerOutboundHandlerAdapter.handlerAdded()
调用:1387686440: TimeServerInboundHandlerAdapter.channelRegistered()
调用:1387686440: TimeServerInboundHandlerAdapter.channelActive()
调用:384931250: TimeServerOutboundHandlerAdapter.read()
调用:1387686440: TimeServerInboundHandlerAdapter.channelRead()
发来的时间: Thu May 10 20:52:45 CST 2018
调用:1387686440: TimeServerInboundHandlerAdapter.channelReadComplete()
调用:384931250: TimeServerOutboundHandlerAdapter.read()
调用:1387686440: TimeServerInboundHandlerAdapter.channelInactive()
调用:1387686440: TimeServerInboundHandlerAdapter.channelUnregistered()
调用:384931250: TimeServerOutboundHandlerAdapter.handlerRemoved()
调用:1387686440: TimeServerInboundHandlerAdapter.handlerRemoved()
调用:657511478: TimeServerInboundHandlerAdapter()
调用:1647464116: TimeServerOutboundHandlerAdapter()
调用:657511478: TimeServerInboundHandlerAdapter.isSharable()
调用:657511478: TimeServerInboundHandlerAdapter.handlerAdded()
调用:1647464116: TimeServerOutboundHandlerAdapter.isSharable()
调用:1647464116: TimeServerOutboundHandlerAdapter.handlerAdded()
调用:657511478: TimeServerInboundHandlerAdapter.channelRegistered()
调用:657511478: TimeServerInboundHandlerAdapter.channelActive()
调用:1647464116: TimeServerOutboundHandlerAdapter.read()
调用:657511478: TimeServerInboundHandlerAdapter.channelRead()
发来的时间: Thu May 10 20:53:23 CST 2018
调用:657511478: TimeServerInboundHandlerAdapter.channelReadComplete()
调用:1647464116: TimeServerOutboundHandlerAdapter.read()
调用:657511478: TimeServerInboundHandlerAdapter.channelInactive()
调用:657511478: TimeServerInboundHandlerAdapter.channelUnregistered()
调用:1647464116: TimeServerOutboundHandlerAdapter.handlerRemoved()
调用:657511478: TimeServerInboundHandlerAdapter.handlerRemoved()
```

参考文章：

[8个java 网络编程框架介绍](https://blog.csdn.net/xiaojin21cen/article/details/78587541 "8个java 网络编程框架介绍")

[Netty.docs: User guide for 4.x](https://netty.io/wiki/user-guide-for-4.x.html "Netty.docs: User guide for 4.x")

[Netty的那点事儿](https://sylvanassun.github.io/2017/11/30/2017-11-30-netty_introduction/ "Netty的那点事儿")

[Netty使用](https://www.jianshu.com/p/e58674eb4c7a "Netty使用")

[Netty学习：搭建一个简单的Netty服务](http://wosyingjun.iteye.com/blog/2303296 "Netty学习：搭建一个简单的Netty服务")

[Netty学习笔记（一）](https://seawaylee.github.io/2017/04/18/%E5%A4%A7%E6%95%B0%E6%8D%AE/%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%9F%BA%E7%A1%80/Netty%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0%EF%BC%88%E4%B8%80%EF%BC%89/ "Netty学习笔记（一）")


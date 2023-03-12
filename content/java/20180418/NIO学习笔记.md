---
createdAt: '2018-04-18'
updatedAt: '2018-04-18'
---

<!--more-->

# 同步与异步
举栗子的解释是最好的。例如我逃了课，如果老师点名了让同学立即叫我。如果是同步的话，同学只会发条微信，我就得一直盯着手机一面错过点名。如果是异步的话，同学就会打电话给我，我就不用一直盯着手机了。

因此，区别在于**被调用者**完成任务时的反应。同步的话，调用者需要等待被调用者返回结果。而异步的话，调用者通知被调用者后会立即返回，调用者就可以干别的活，被调用者会通知调用者任务完成。

# 阻塞与非阻塞
继续举栗子。点名的话我让同学叫我，但是我不知道同学是微信我还是电话我。但不要紧，如果是阻塞的话，我就挂起我自己，一直盯着手机。如果是非阻塞的，我就每隔一段时间看一看手机。

因此，区别在于**调用者**等待任务完成的反应。阻塞的话，调用者主动挂起等待被调用者完成任务。非阻塞的话，在被调用者完成任务之前，调用者不会阻塞，还能做别的事情。

所以同步与异步，阻塞与非阻塞构成四种排列组合。

1. 同步阻塞，被调用者在任务完成时才返回。调用者也一直等被调用者完成
2. 同步非阻塞，被调用者在任务完成时才返回。调用者时不时检查被调用者返回了没有，期间还能做点别的
3. 异步阻塞，被调用者都立即返回，任务完成后通知调用者。但是调用者还是一直傻傻等被调用者完成
4. 异步非阻塞，被调用者都立即返回，任务完成后通知调用者。调用者就可以干脆不检查了，去做别的事

# NIO
java里的传统的流，是阻塞IO。即InputStream执行read方法，会阻塞直到写进硬盘里（？），OutputStream执行write方法，会阻塞知道从硬盘读取到数据为止。而NIO是非阻塞。因此可以先遇见，在NIO里执行read方法或者write方法可以立即返回。当然这种立即返回不代表已经读写入/读取到数据，因此需要循环来多次检查执行read方法或者write方法。

# Buffer
Buffer是NIO的缓存，用来存储数据，角色相当与在IO流里的byte数组。Buffer实现有：ByteBuffer，CharBuffer，DoubleBuffer，FloatBuffer，IntBuffer，LongBuffer，ShortBuffer。对于了各个基本类型。程序要获取数据就需要在Buffer里获取，要写数据就得先把数据写到Buffer里。其操作有一定的流程：
```java
//0.创建一个Buffer
ByteBuffer byteBuffer = ByteBuffer.allocate(8);//指定Buffer最大容量，一旦创建容量就不能修改。往Buffer里写入的数据也不能大于他的最大容量，否则会报错
//1.对buffer对象有或者没有进行某某操作之后
//2.现在想往buffer对象里写入数据
buffer.clear();//会将buffer里的全部数据“清除”
//或者
buffer.compact();//会将buffer里的已读数据“清除”
//3.任何的，往buffer里写入数据的操作，包括直接从buffer里写入数据，以及通过Channel写入等
//4.现在又想在buffer里读数据出来
buffer.filp();//将buffer致为读取状态
//5.任何的，从buffer里读取数据的操作，包括直接从buffer里读取数据，以及通过Channel读取等
```

# Channel
Channel叫做管道，角色相当于IO流里的InputStream和OutputStream。不同的是InputStream只能输入，OutputStream只能输出。而Channel实现了既能输入也能输出的方法。因此，要从外面读取数据，就调用`int channel.read(buffer)`,返回已经读取的数据长度。由于是非阻塞的，所以可能一个数据都还没读取到，返回0，返回-1就是读取到底了。要往外面输出数据，就要调用`long channel.write(buffer)`，返回已经输出的数据长度。

# FileChannel
还有一点要注意的，Channel的创建可以像RandomAccessFile那样用InputStream，OutputStream，但是就相应的只读或者只写了。并且FileChannel还是阻塞的，不能设置为非阻塞。
```java
public static final void fileRead() throws IOException {
    RandomAccessFile randomAccessFile = new RandomAccessFile("/home/cellargalaxy/nio.txt", "rw");
    FileChannel fileChannel = randomAccessFile.getChannel();
    ByteBuffer byteBuffer = ByteBuffer.allocate(8);
    
    int len;
    while ((len = fileChannel.read(byteBuffer)) != -1) {//buffer任意的写操作
        byteBuffer.flip();//buffer转为读状态
        System.out.print(new String(byteBuffer.array(), 0, len));//buffer任意的读操作
        byteBuffer.clear();//buffer清空
    }
    
    fileChannel.close();
    randomAccessFile.close();
}

public static final void fileWrite() throws IOException {
    RandomAccessFile randomAccessFile = new RandomAccessFile("/home/cellargalaxy/nio.txt", "rw");
    FileChannel fileChannel = randomAccessFile.getChannel();
    ByteBuffer byteBuffer = ByteBuffer.allocate(128);
    
    byteBuffer.put((UUID.randomUUID().toString() + "\n").getBytes());//buffer任意的写操作
    byteBuffer.put((UUID.randomUUID().toString() + "\n").getBytes());
    byteBuffer.put((UUID.randomUUID().toString() + "\n").getBytes());
    byteBuffer.flip();//buffer转为读状态
    while (byteBuffer.hasRemaining()) {//还有没有没读完的数据
        fileChannel.write(byteBuffer);//buffer任意的读操作
    }
    
    fileChannel.close();
    randomAccessFile.close();
}
```

# SocketChannel
SocketChannel就是非阻塞的了，就是非阻塞的Socket的输入输出流版。
```java
public static final void client0() throws IOException, InterruptedException {
    SocketChannel socketChannel = SocketChannel.open(new InetSocketAddress("127.0.0.1", 8787));//创建一个SocketChannel
    socketChannel.configureBlocking(false);//设置为非阻塞，FileChannel没得设置。
    ByteBuffer byteBuffer = ByteBuffer.allocate(64);

    if (socketChannel.finishConnect()) {
        byteBuffer.put("GET / HTTP/1.1\nHost:www.baidu.com\n".getBytes());//buffer任意的写操作
        byteBuffer.flip();//buffer转为读状态
        while (byteBuffer.hasRemaining()) {//还有没有没读完的数据
            System.out.println("write: " + socketChannel.write(byteBuffer));//buffer任意的读操作
        }

        byteBuffer.clear();//buffer清空
        int len;
        while (true) {
            while ((len = socketChannel.read(byteBuffer)) > 0) {//buffer任意的写操作
//                    System.out.println("已经读取的byte数：" + len);
                byteBuffer.flip();//buffer转为读状态
                System.out.print(new String(byteBuffer.array(), 0, len));//buffer任意的读操作
                byteBuffer.clear();//buffer清空，开始新的循环
            }
            if (len == -1) {
                System.out.println("close");
                break;
            }
            TimeUnit.SECONDS.sleep(1);
        }
    }

    socketChannel.close();
}
//先用传统的ServerSocket做测试
public static void server0() throws IOException {
    ServerSocket serverSocket = new ServerSocket(8787);
    Socket socket = serverSocket.accept();
    SocketAddress socketAddress = socket.getRemoteSocketAddress();
    System.out.println("Handling client at " + socketAddress);
    InputStream in = socket.getInputStream();
    byte[] bytes = new byte[1024];
    int len;
    StringBuilder stringBuilder = new StringBuilder();
    while (stringBuilder.length() < 34 && (len = in.read(bytes)) != -1) {//还没接收够34个字符的数据并且还有数据来
        stringBuilder.append(new String(bytes, 0, len));
//            System.out.println("??>>" + len + "?" + stringBuilder.length() + " : " + new String(bytes, 0, len));
    }
    System.out.println(stringBuilder.toString());
    
    OutputStream outputStream = socket.getOutputStream();//接收够34个字符之后往对方写些数据
    for (int i = 0; i < 10; i++) {
        outputStream.write(("data:" + i + "\n").getBytes());
    }
    socket.close();
    serverSocket.close();
}
```
# Selector
既然NIO可以非阻塞，那我们就可以创建多几个管道，单个线程下，没有数据需要输入输出的管道就先不管，只操作有数据输入输出的管道。那这样就意味着我们可能需要不断遍历全部管道，检查各个管道的情况。这样效率并不高（不是很懂为什么）。因此相比输入输出流，NIO多个一个Selector用来管理多个管道，通过Selector给各个管道注册我们像操作的情况，从Selector就能获取正在发送这种情况的管道了。
```java
public static final void server2() throws IOException {
    Selector selector = Selector.open();//创建一个Selector
    
    ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();//创建一个ServerSocketChannel
    serverSocketChannel.socket().bind(new InetSocketAddress(8787));//设置端口
    serverSocketChannel.configureBlocking(false);//设置非阻塞
    serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);//绑定到Selector里，当有连接事件时触发
    
    while (true) {
        if (selector.select(3000) == 0) {//有多少个注册了的管道发生了事件
            System.out.println("==");
            continue;
        }
        
        Iterator<SelectionKey> iterator = selector.selectedKeys().iterator();//获取全部发送了事件的管道
        while (iterator.hasNext()) {
            SelectionKey selectionKey = iterator.next();
            if (selectionKey.isAcceptable()) {//如果是有新连接进来
                ServerSocketChannel serverSocket = (ServerSocketChannel) selectionKey.channel();//获取注册的管道，便是ServerSocketChannel了
                SocketChannel socketChannel = serverSocket.accept();//获取新连接的SocketChannel
                socketChannel.configureBlocking(false);//设置非阻塞
                socketChannel.register(selectionKey.selector(), SelectionKey.OP_READ, ByteBuffer.allocate(1024));//把新连接注册到selector里，事件是有可读的
            }
            if (selectionKey.isReadable()) {//当有管道有可读事件
                SocketChannel socketChannel = (SocketChannel) selectionKey.channel();//便是SocketChannel了
                ByteBuffer byteBuffer = (ByteBuffer) selectionKey.attachment();//获取注册时顺带的ByteBuffer
                byteBuffer.clear();
                int len;
                while ((len = socketChannel.read(byteBuffer)) > 0) {
                    byteBuffer.flip();
                    System.out.print(new String(byteBuffer.array(), 0, len));
                    byteBuffer.clear();
                }
                if (len == -1) {
                    socketChannel.close();
                    System.out.println("close");
                }else {
                    byteBuffer.clear();
                    byteBuffer.put("i an server.\n".getBytes());
                    byteBuffer.flip();
                    while (byteBuffer.hasRemaining()) {
                        System.out.println("write1: " + socketChannel.write(byteBuffer));
                    }
                }
            }
            if (selectionKey.isWritable() && selectionKey.isValid()) {//当有管道有可写事件并且是有效管道
                SocketChannel socketChannel = (SocketChannel) selectionKey.channel();//便是SocketChannel了
                ByteBuffer byteBuffer = (ByteBuffer) selectionKey.attachment();//获取注册时顺带的ByteBuffer
                byteBuffer.flip();
                while (byteBuffer.hasRemaining()) {
                    System.out.println("write2: " + socketChannel.write(byteBuffer));
                }
            }
            if (selectionKey.isConnectable()) {
                System.out.println("isConnectable");
            }
            iterator.remove();//最后要删除以及操作了管道，不然selector不会从队列里 删除以及操作了的管道
        }
    }
}
```


参考文献

[ 攻破JAVA NIO技术壁垒](https://blog.csdn.net/u013256816/article/details/51457215 " 攻破JAVA NIO技术壁垒")（找了好多篇文章，唯有这篇能简单清楚讲清的）

[【那些年遇到过的面试题】阻塞 非阻塞 同步 异步 I/O 模型](https://blog.csdn.net/carol123456/article/details/51955264 "【那些年遇到过的面试题】阻塞 非阻塞 同步 异步 I/O 模型")
---
createdAt: '2018-05-18'
updatedAt: '2018-05-18'
---
之前我理解的通讯比较狭隘，以为要是传输数据。但是看了别人的，发现哪怕是信号的传递，同步，也叫通讯。

# 线程与进程之间的关系
进程是系统进行资源分配和调度的独立单位，有自己独立的地址空间。是一个程序在有个数据集合上面的一次活动。而线程是进程的实体，是cpu调度和分派的基本单位。线程除了最基本的栈，程序计数器意外，不拥有专属资源。但可以与进程下的其他线程共享进程的全部资源。

线程是进程的不同的执行路径。一个进程奔溃后，在保护模式下不会对其他进程造成影响。而一个线程死掉就等于整个进程死掉。因此，进程的健壮性比线程好，但是切换开销大。对于要同时进行又要共享变量，只能用线程。

<!--more-->

# java线程之间的通讯
1. synchronized、wait()、notify()和Lock、Condition、await()、signal()。这样只能进行同步的信号传递。
2. CountDownLatch，CyclicBarrier和Semaphore。同步信号传递。
3. 共享变量。共享变量既能传递信号也能传递数据，当共享变量本书就是数据时。为了各个线程之间正确使用共享变量，共享变量一般是搭配同步的手段来使用的。同步的手段有锁和volatile。
4. 阻塞队列。应该说是阻塞队列作为一个共享变量在线程之间进行通讯，既能传递信号也能传递数据。其内部已经封装了同步手段。
5. PipedInputStream和PipedOutputStream
```java
PipedInputStream in = new PipedInputStream();
PipedOutputStream out = new PipedOutputStream();
in.connect(out);
```

# 进程之间通讯
1. 匿名管道（pipe）有两个限制，一个是半双工的，流是单向的，二是只能在亲戚进程（父子兄弟）进程之间传输。是一种单独的文件系统，只存在于内存中。
2. 有名管道（named pipe）也是半双工，但是比匿名管道突破了只能亲戚进程之间的限制。因为其名字存在于文件系统中，内容在内存中。只要进程访问对应路径，管道就能相互通讯。
3. 信号量（semophore）是一个计数器，一般用来做锁同步。
4. 消息队列（message queue）是由消息组成的链表，存放在内核中。克服了管道的无结构字节流和缓冲区大小有限，信号量的传递信息少。
5. 信号（signal）是一个复杂的通讯方式，用来通知其他进程某事件已经发生。
6. 共享内存（shared memory）由一个进程创建，但可以多个线程直接读写同一块内存，是最快的可用IPC。需要一定的同步机制（如信号量）。
7. 套接字（socket）不仅可以单机，还可以在网络相连下，多机进程通讯。

参考文章：

[JAVA线程间通信的几种方式](http://edisonxu.com/2017/03/02/java-thread-communication.html "JAVA线程间通信的几种方式")

[进程间通信IPC (InterProcess Communication)](https://www.jianshu.com/p/c1015f5ffa74 "进程间通信IPC (InterProcess Communication)")

[进程间的几种通信方式的比较和线程间的几种通信方式](https://blog.csdn.net/yang_teng_/article/details/53325280 "进程间的几种通信方式的比较和线程间的几种通信方式")

[Linux进程间通信的几种方式总结--linux内核剖析（七）](https://blog.csdn.net/gatieme/article/details/50908749 "Linux进程间通信的几种方式总结--linux内核剖析（七）")
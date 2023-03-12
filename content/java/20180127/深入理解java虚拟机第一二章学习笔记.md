---
createdAt: '2018-01-27'
updatedAt: '2018-01-27'
---

<!--more-->

第一章主要是介绍java的发展史，java虚拟机的发展史以及如何编译jdk。
# jvm发展历程
Sun Classic VM是第一代jvm，通过纯解释来执行java代码。

后来被Exact VM替代。Exact VM比Sun Classic VM进步的地方是它使用了精确式内存管理，意思即是例如内存里一个32位的整数123456，Exact VM有能力判断出这个整数是表示一个数值为123456的整数，还是其实是一个reference类型指向123456的内存地址。

没过多久Exact VM又被Sun Hotspot VM取代。Hotspot除了继承前两个虚拟机的有点以外（如精确式内存管理），他还有热点代码探测技术。Hotspot通过探测调用频繁的代码，以方法为单位，通知JIT进行编译，平衡启动时间和执行效率。

除此以外还有各种各样的jvm。。。

第二章大致简介了Hotspot的内存模型和模拟了各种内存溢出的异常

内存区域|线程共享/隔离|异常类型
-------|------------|-------
程序计数器|隔离|jvm规范没有规定任何的OutOfMenoryError
方法区|共享|OutOfMenoryError
虚拟机栈|隔离|OutOfMenoryError，StackOverflowError
本地方法栈|隔离|OutOfMenoryError，StackOverflowError
java堆|共享|OutOfMenoryError

# 程序计数器
程序计数器的是用来标记虚拟机执行字节码文件执行到哪一行。由于不同线程执行并无相关，所以不同线程所需标记的字节码行各不相同，因此可以理解程序计数器是线程隔离的。内存大小叫嚣，可以忽略不计。
# 方法区
方法区并不是用来存放方法的区域，而是用来存储jvm加载的各种类信息，常量，静态变量等。可见，不同线程都可能需要创建同类型的对象，获取相同的类信息，常量，静态变量等，因此方法区是线程共享的。
# 虚拟机栈
虚拟机栈才是用来存放方法的。方法之间相互调用，最后一个被调用的方法会最先被执行完（或者叫返回），因此方法之间的调用是个栈结构。在方法内部定义的变量是方法私有的，所以虚拟机栈的并没有线程共享的需求，所以虚拟机栈是线程隔离的会更加安全。在方法内部的基本数据类型和引用变量（reference类型）对于某个确定的方法而言是确定的。所以方法所占用的内存大小在编译的时候就已经可以确定。这些局部变量就存放在虚拟机栈的局部变量表里面。每调用一次方法，就往虚拟机栈里压入一个栈帧。虽然书上没有明说，但我感觉虚拟机栈由里面的栈帧来构成，每个栈帧里包含此栈帧的局部变量表，因为用一个方法在不同时候，即在栈的不同位置，方法里面的局部变量应该是无关的，简单方便就是每个栈帧都有他自己的局部遍历表，如果整个虚拟机栈维持一个局部变量表岂不难度好大？虚拟机栈不可能无限深，深过头内存就不够了，又申请不了足够的内存，会报OutOfMenoryError，除了客观的内存不够，还可以认为限定栈的深度，超过限定的深度，就会报StackOverflowError。
# java堆
java堆是jvm里内存部分最大的了，因为我们创建的对象绝大部分都是储存在这里。也是GC的主要管理区域。java堆在物理内存上可以不连续，只要逻辑上是连续即可。由于现在的收集器基本采用分代收集算法，在java堆里，还可以分为新生代和老年代。同样，如果java堆内存不够，又申请不了足够的新内存，就会报OutOfMenoryError。

还有其他内存如包含在方法区里的运行时常量池，直接内存就不说了。
# 对象的结构和访问
在内存中的对象分为三部分：对象头，实例数据，对其填充。

对象头又包含两部分的信息，第一部分是类型指针，指向改对象的类数据，应该是用来表明这个对象是什么类。第二部分是对象自身的运行时数据，如哈希码，GC分代年龄，锁状态标志，线程持有的锁，偏向锁ID，偏向时间戳等。

对对象发访问有两种，一种是通过句柄访问对象，另一种是直接通过指针访问对象。直接通过指针访问对象好说，就是一个指针直接指向在java堆里的内存地址，这些数据包含对象头，实例数据，对其填充。其中对象头又指向方法区里此对象的类信息地址。而句柄访问reference指向句柄地址，而句柄则是在java堆里划出一部分内存用来存放各个对象的句柄，句柄包含两个指针，一个指证是指向实例数据，另一个指针指向方法区里此对象的类信息地址。

# 实战OutOfMenoryError异常
```java
import java.util.LinkedList;

/**
 * java堆溢出
 *
 * VM Args: -Xms2m -Xmx2m -XX:+HeapDumpOnOutOfMemoryError
 *
 * Created by cellargalaxy on 18-1-28.
 */
public class HeapOOM {
    public static void main(String[] args) {
        LinkedList<HeapOOM> linkedList=new LinkedList<HeapOOM>();
        while (true) {
            linkedList.add(new HeapOOM());
        }
    }
}
```
结果
```shell
cellargalaxy:/tmp/jvm$ java -Xms2m -Xmx2m -XX:+HeapDumpOnOutOfMemoryError HeapOOM 
java.lang.OutOfMemoryError: Java heap space
Dumping heap to java_pid7166.hprof ...
Heap dump file created [3193473 bytes in 0.016 secs]
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
    at HeapOOM.main(HeapOOM.java:14)
```
```java
/**
 * 虚拟机栈过深
 *
 * VM Args: -Xss128k
 *
 * Created by cellargalaxy on 18-1-28.
 */
public class JavaVMStackSOF {
    private int stackLength=0;
    public void stackLeak(){
        stackLength++;
        stackLeak();
    }
    
    public static void main(String[] args) {
        JavaVMStackSOF javaVMStackSOF=new JavaVMStackSOF();
        try {
            javaVMStackSOF.stackLeak();
        }catch (Throwable e){
            System.out.println("stack length: "+javaVMStackSOF.stackLength);
            e.printStackTrace();
        }
    }
}
```
结果
```shell
cellargalaxy:/tmp/jvm$ java -Xss128k JavaVMStackSOF 

The stack size specified is too small, Specify at least 228k
Error: Could not create the Java Virtual Machine.
Error: A fatal exception has occurred. Program will exit.

cellargalaxy:/tmp/jvm$ java -Xss228k JavaVMStackSOF 
stack length: 18427
java.lang.StackOverflowError
    at jvm.JavaVMStackSOF.stackLeak(JavaVMStackSOF.java:14)
    at jvm.JavaVMStackSOF.stackLeak(JavaVMStackSOF.java:14)
    at jvm.JavaVMStackSOF.stackLeak(JavaVMStackSOF.java:14)
    ……
```
```java
/**
 * 虚拟机栈溢出
 *
 * VM Args: -Xss2m
 *
 * Created by cellargalaxy on 18-1-28.
 */
public class JavaVMStackOOM {
    private void dontstop(){
        while (true) {
        
        }
    }
    public void stackLeakByThread(){
        while (true) {
            Thread thread=new Thread(new Runnable() {
                public void run() {
                    dontstop();
                }
            });
            thread.start();
        }
    }
    
    public static void main(String[] args) {
        JavaVMStackOOM javaVMStackOOM=new JavaVMStackOOM();
        javaVMStackOOM.stackLeakByThread();
    }
}
```
结果没有结果，我的是jdk8，书的应该是jdk7，cpu占用100%，内存没有明显增加
```java
/**
 * 在jdk7和jdk8中，String的intern方法会在常量池里记录第一次此字符串出现的指针
 * 因为“计算机软件”是第一次出现，所以intern根据指针返回的仍然是他自己
 * 但是“java”是StringBuilder的toString之前出现过，所以intern返回的第一个“java”而不是下面的“java”对象
 * 怎么“java”在StringBuilder的toString之前出现过呢？？？？
 * 我也不知道，但结果确实是false，把java换成其他字符串就是true
 * 只能猜是官方类里加载过“java”了
 *
 * Created by cellargalaxy on 18-1-28.
 */
public class RuntimeConstantPoolOOM {
    public static void main(String[] args) {
        String string1=new StringBuilder("计算机").append("软件").toString();
        System.out.println(string1==string1.intern());
        
        String string2=new StringBuilder("ja").append("va").toString();
        System.out.println(string2==string2.intern());
    }
}
```
结果
```
true
false
```
```java
import sun.misc.Unsafe;

import java.lang.reflect.Field;

/**
 * 本机内存直接溢出
 *
 * VM Args: -Xmx20m -XX:MaxDirectMemorySize=10m
 *
 * Created by cellargalaxy on 18-1-28.
 */
public class DirectMemoryOOM {
    private final static int _1MB=1024*1024;
    public static void main(String[] args) throws IllegalAccessException {
        while (true) {
            Field unsafeField= Unsafe.class.getDeclaredFields()[0];
            unsafeField.setAccessible(true);
            Unsafe unsafe= (Unsafe) unsafeField.get(null);
            while (true) {
                unsafe.allocateMemory(_1MB);
            }
        }
    }
}
```
结果，内存占到百分之九十几，之后被自动杀死
```shell
cellargalaxy:/tmp/jvm$ java -Xmx20m -XX:MaxDirectMemorySize=10m DirectMemoryOOM
已杀死
```



















---
createdAt: '2018-03-19'
updatedAt: '2018-03-19'
---

<!--more-->

# jstack

jstack用于查看java的某个进程的线程的堆栈信息，先来个死循环。

由于图床有点bug，上传不了图片，所以就先盗别人的图顶着先了。
```java
class Jstack {
    public static void main(String[] args) {
        while (true) {
            if (Math.random()==Math.random()) {
                System.out.println("zhe me qiao");
            }
        }
    }
}
```


使用`top`查看那个java进程占用cpu最多，得到进程pid

![](/file/blog/code/20180319/upload-images.jianshu.io-upload_images-2184951-b61659815716a054.png.1.png)

然后使用`top -Hp 进程pid`获得此进程的全部线程

![](/file/blog/code/20180319/upload-images.jianshu.io-upload_images-2184951-831f6716e5801e63.png.1.png)

我们就可以发现cpu占用最大的线程的线程pid了，为了接下来好观察，我们需要使用`printf "%x\n" 线程pid`把线程pid转换为16进制。

最后使用`jstack 进程pid`，就能查看此进程的线程的堆栈情况。为了找到我们需要的线程，线程的pid在信息里是在`nid`后面的。但是我发现进行这个死循环一段时间之后就会自动爆出一下信息，然后jstack命令就会查询失败。我用的是jdk8，可能是新jdk的新功能吧。
```
root@cellargalaxy-Lenovo-G50-80:/usr/local/java/jdk1.8.0_131/bin# ./jstack 18287
18287: Unable to open socket file: target process not responding or HotSpot VM not loaded
The -F option can be used when the target process is not responding
```
例如下面这个片段，死循环线程pid是0x4770。
```
"Finalizer" #3 daemon prio=8 os_prio=0 tid=0x00007f0bec083800 nid=0x4777 in Object.wait() [0x00007f0bc74d2000]
   java.lang.Thread.State: WAITING (on object monitor)
    at java.lang.Object.wait(Native Method)
    - waiting on <0x00000000d6e08ec8> (a java.lang.ref.ReferenceQueue$Lock)
    at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)
    - locked <0x00000000d6e08ec8> (a java.lang.ref.ReferenceQueue$Lock)
    at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)
    at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)

"Reference Handler" #2 daemon prio=10 os_prio=0 tid=0x00007f0bec07f000 nid=0x4776 in Object.wait() [0x00007f0bc75d3000]
   java.lang.Thread.State: WAITING (on object monitor)
    at java.lang.Object.wait(Native Method)
    - waiting on <0x00000000d6e06b68> (a java.lang.ref.Reference$Lock)
    at java.lang.Object.wait(Object.java:502)
    at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
    - locked <0x00000000d6e06b68> (a java.lang.ref.Reference$Lock)
    at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)

"main" #1 prio=5 os_prio=0 tid=0x00007f0bec009800 nid=0x4770 runnable [0x00007f0bf4082000]
   java.lang.Thread.State: RUNNABLE
    at Jstack.main(T.java:4)
```

# jinfo
jinfo用来查看jvm的参数，用法是`jinfo 进程pid`。然后他会罗列好多好多信息。例如执行`java Jstack -Xms30m -Xmx60m`
```
Attaching to process ID 19664, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.131-b11
Java System Properties:

java.vm.name = Java HotSpot(TM) 64-Bit Server VM    虚拟机
user.dir = /tmp        执行目录
java.runtime.version = 1.8.0_131-b11        jre版本
os.arch = amd64        cpu？

os.name = Linux        系统
java.class.version = 52.0        class版本
sun.management.compiler = HotSpot 64-Bit Tiered Compilers        还是虚拟机
user.home = 用户目录
user.name = 用户名
sun.java.command = Jstack -Xms30m -Xmx60m        执行java命令时添加的jvm参数
java.version = 1.8.0_131        jdk版本？

VM Flags:        其余乱七八糟的参数？
Non-default VM flags: -XX:CICompilerCount=3 -XX:InitialHeapSize=130023424 -XX:MaxHeapSize=2069889024 -XX:MaxNewSize=689963008 -XX:MinHeapDeltaBytes=524288 -XX:NewSize=42991616 -XX:OldSize=87031808 -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:+UseParallelGC 
Command line:
```

# jmap
jmap用于查看内存情况，用法：`jmap -heap 进程pid`
```java
import java.util.LinkedList;
public class HeapOOM {
    public static void main(String[] args) throws InterruptedException {
        LinkedList<HeapOOM> linkedList=new LinkedList<HeapOOM>();
        while (true) {
            linkedList.add(new HeapOOM());
            Thread.sleep(1);
        }
    }
}
```
执行`java -Xms2m -Xmx2m -XX:+HeapDumpOnOutOfMemoryError HeapOOM`，限制一下堆大小。然后好不容易试到了下面的jmap
```
Attaching to process ID 21125, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.131-b11

using thread-local object allocation.
Parallel GC with 4 thread(s)

Heap Configuration:
   MinHeapFreeRatio         = 0
   MaxHeapFreeRatio         = 100
   MaxHeapSize              = 2097152 (2.0MB)        指定的最大对内存2m
   NewSize                  = 1572864 (1.5MB)
   MaxNewSize               = 1572864 (1.5MB)
   OldSize                  = 524288 (0.5MB)        应该是指老年代大小
   NewRatio                 = 2
   SurvivorRatio            = 8            新生代那个复制算法的比例
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 524288 (0.5MB)                    应该是Eden的大小
   used     = 335896 (0.32033538818359375MB)    Eden用了0.32m
   free     = 188392 (0.17966461181640625MB)    Eden剩余0.179m
   64.06707763671875% used                        Eden用了64%
From Space:
   capacity = 524288 (0.5MB)
   used     = 515640 (0.49175262451171875MB)
   free     = 8648 (0.00824737548828125MB)
   98.35052490234375% used
To Space:
   capacity = 524288 (0.5MB)
   used     = 0 (0.0MB)
   free     = 524288 (0.5MB)
   0.0% used
PS Old Generation                                老年代
   capacity = 524288 (0.5MB)
   used     = 385672 (0.36780548095703125MB)
   free     = 138616 (0.13219451904296875MB)
   73.56109619140625% used

654 interned Strings occupying 44000 bytes.
```
之后的情况
```
Attaching to process ID 21125, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.131-b11

using thread-local object allocation.
Parallel GC with 4 thread(s)

Heap Configuration:
   MinHeapFreeRatio         = 0
   MaxHeapFreeRatio         = 100
   MaxHeapSize              = 2097152 (2.0MB)
   NewSize                  = 1572864 (1.5MB)
   MaxNewSize               = 1572864 (1.5MB)
   OldSize                  = 524288 (0.5MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 524288 (0.5MB)
   used     = 524280 (0.49999237060546875MB)        Eden用了0.49m
   free     = 8 (7.62939453125E-6MB)                Eden几乎没剩了
   99.99847412109375% used                            Eden用了99%
From Space:
   capacity = 524288 (0.5MB)
   used     = 515640 (0.49175262451171875MB)
   free     = 8648 (0.00824737548828125MB)
   98.35052490234375% used
To Space:
   capacity = 524288 (0.5MB)
   used     = 0 (0.0MB)
   free     = 524288 (0.5MB)
   0.0% used
PS Old Generation            Eden满了，老年代的使用也增加，所剩无几了
   capacity = 524288 (0.5MB)
   used     = 454496 (0.433441162109375MB)
   free     = 69792 (0.066558837890625MB)
   86.688232421875% used

654 interned Strings occupying 44000 bytes.
```

参考文章：
[如何使用jstack分析线程状态](https://www.jianshu.com/p/6690f7e92f27 "如何使用jstack分析线程状态")

[JVM性能调优监控工具jps、jstack、jmap、jhat、jstat、hprof使用详解](https://my.oschina.net/feichexia/blog/196575 "JVM性能调优监控工具jps、jstack、jmap、jhat、jstat、hprof使用详解")
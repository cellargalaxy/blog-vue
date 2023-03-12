---
createdAt: '2020-05-18'
updatedAt: '2020-05-18'
---
java除了基本类型以外，其余的都是引用类型。
而java的引用类型有四种：强引用，软引用，弱引用和虚引用。
除了强引用外，其余的引用都是抽象类Reference的子类。

<!--more-->

# 强引用
形如`Object object = new Object();`就是强引用。只有强引用还存在，虚拟机就不会回收这个对象。
就是内存不够，也另可报OutOfMemoryError异常。直到一个对象没有强引用，虚拟机才会认为这个对象是可回收的。

# 软引用（SoftReference）
软引用对象，虚拟机是认为可回收的，但是只有虚拟机认为内存不够的时候才会回收。
因此在报内存溢出以前，虚拟机是已经回收了全部软引用了。内存充足时虚拟机倾向于保留对象在内存里。
因此软引用适合于做一些本地缓存。

# 弱引用（WeakReference）
弱引用对象，虚拟机认为是可回收的，并且在GC时发现有弱引用对象就会回收。

# 虚引用
虚引用对象，虚拟机认为这个对象跟没有引用一样，会在GC时进行回收。
不同于软引用和弱引用，虚引用通过get方法获取对象永远为null。
虚引用的作用仅仅是在对象在执行finalize方法之后，用户程序获知并可以做某些事情的机制。
例如可以用来监控对象的回收。

# 引用队列（ReferenceQueue）
如果给软引用、弱引用和虚引用添加一个引用队列的话，在引用对象被回收后，虚拟机会将引用加入到这个队列里，用户程序可以在这个队列里查找已经被回收的对象的引用。
当然更加直接可以通过get方法判断对象是否已经被回收。虽然引用对象非强引用，但是引用本身是强引用，便于我们在需要时把引用设为null（如在引用数组里，如ThreadLocal）。

# GC的重新标记/最终标记
为什么CMS和G1在并发标记之后需要重新标记/最终标记。所谓的在并发标记，用户程序还在执行会导致对象引用状态改变的其中一种情况就是。
例如在并发标记一开始标记了一个弱引用对象需要被回收，但是之后用户程序从弱引用里取出对象变成了强引用。
这就导致需要再进行一次STW的重新标记，检查那些被标记为需要回收的对象有没有复活。
不过这个有个没想懂的问题，CMS在清除的时候是与用户线程并发的，这时候不也会有取出对象变强引用，但却被回收的问题吗？

# ThreadLocal
每个线程都有一个ThreadLocalMap对象，这个map的key是ThreadLocal，value是我们要保存的数据。`Thread->ThreadLocalMap<ThreadLocal,T>`。
例如get对象时，ThreadLocal里通过currentThread获取ThreadLocalMap对象，再通过`map.get(this)`获取对象。
但ThreadLocalMap对ThreadLocal的引用是弱引用，这样当ThreadLocal的强引用都消失时，GC就能回收ThreadLocal对象。
剩下key是null的value，但是ThreadLocalMap对value的引用强引用，value并不会被GC回收。久而久之就会内存溢出。
所以在其他ThreadLocal调用get、set、remove方法时，都可能会检查清理ThreadLocalMap中key为null的value。
最后，为什么不把value也弄成弱引用呢？value只被ThreadLocalMap弱引用就被回收了呀，转个头ThreadLocal来取值发现value是null的？
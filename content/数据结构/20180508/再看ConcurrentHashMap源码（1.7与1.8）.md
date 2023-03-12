---
createdAt: '2018-05-08'
updatedAt: '2018-05-08'
---

<!--more-->

之前我写的[临急抱佛脚之ConcurrentHashMap源码](http://119.23.235.95:83/article/138240 "临急抱佛脚之ConcurrentHashMap源码")是java7的实现。面试的时候被问到ConcurrentHashMap在java7和java8的实现上有什么区别，我就只知道个会链表变红黑树。至于java8中新的并发机制却没有了解。为此补这篇文章。

# Java7的ConcurrentHashMap
先看图回顾一个java7的ConcurrentHashMap实现。ConcurrentHashMap下面是final segment[]，而每个segment都像一个hashMap一样，由volatile HashEntry[]组成。在get时，由于HashEntry[]是volatile，所以不用加锁。当put/remove时，每个segment都继承了ReentrantLock，修改segment的HashEntry[]时要先获取相应的segment的锁，来确保数据安全。其核心想法就是分段锁技术。操作的地方不同，数据不会相互影响，就用不同的锁。

![](/file/blog/code/20180508/www.jasongj.com-img-java-concurrenthashmap-concurrenthashmap_java7.png.1.png)

# Java8的ConcurrentHashMap
那既然操作的地方不同，数据不会相互影响，就用不同锁。不同的操作地方越多，锁就可以设置越多，并发能力就越高。为何还要segment呢，为何不把这个所谓操作的不同地方的颗粒度尽可能减小，令锁尽可能多呢？因此，java8抛弃的segment这种臃肿的，没有把锁颗粒度最小化的实现方法。取而代之的是，结构恢复hashMap那样，以桶为单位，使用CAS和synchronized进行同步操作。如下图（对，结构压根就跟HashMap一样），结构只有一个Node[]

```java
static class Node<K, V> implements Map.Entry<K, V> {
    final int hash;
    final K key;
    volatile V val;
    volatile Node<K, V> next;
    //。。。
}
static final class TreeNode<K, V> extends Node<K, V> {
    TreeNode<K, V> parent;  // red-black tree links
    TreeNode<K, V> left;
    TreeNode<K, V> right;
    TreeNode<K, V> prev;    // needed to unlink next upon deletion
    boolean red;
    //。。。
}
```

![](/file/blog/code/20180508/www.jasongj.com-img-java-concurrenthashmap-concurrenthashmap_java8.png.1.png)

# 成员变量
```java
//默认为null，初始化发生在第一次插入操作，默认大小为16，主要数据结构
transient volatile Node<K, V>[] table;
//默认为null，扩容时新生成的数组，其大小为原数组的两倍
private transient volatile Node<K, V>[] nextTable;
//元素的个数
private transient volatile long baseCount;
/**
 * 默认为0，用来控制table的初始化和扩容操作
 * table未初始化: table需要初始化的大小
 * table正在初始化: -1
 * table初始化完成: table的容量，默认是table大小的0.75倍
 * 有N-1个线程正在进行扩容操作: -N
 */
private transient volatile int sizeCtl;
//与扩容有关
private transient volatile int transferIndex;
//与计算元素个数有关
private transient volatile int cellsBusy;
//与计算元素个数有关
private transient volatile CounterCell[] counterCells;
```

# put操作
1. 桶还没初始化，用cas进行初始化
2. 桶已经初始化，（且当前该节点不处于移动状态？是啥意思？），就用synchronized加锁。并且该节点的hsah不小于0（？），则：
3. 是链表遍历链表插入，否则在红黑树里插入
4. binCount不为0的话，证明数据发生了改变（？）。当链表太长，就转变为红黑树。如果oldVal不为空，说明是一次更新操作，没有对元素个数产生影响，则直接返回旧值
5. 如果是新插入数据，执行addCount()尝试更新元素个数baseCount

```java
public V put(K key, V value) {
    return putVal(key, value, false);
}

final V putVal(K key, V value, boolean onlyIfAbsent) {
    if (key == null || value == null) throw new NullPointerException();//key-value不允许空值
    int hash = spread(key.hashCode());//算hash
    int binCount = 0;
    for (Node<K, V>[] tab = table; ; ) {
        Node<K, V> f;
        int n, i, fh;
        if (tab == null || (n = tab.length) == 0)//如果table是空的就初始化一下
            tab = initTable();
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {//否则获取到桶，如果桶是空的
            if (casTabAt(tab, i, null, new Node<K, V>(hash, key, value, null)))//就用cas往桶里插入第一个值
                break;
        } else if ((fh = f.hash) == MOVED)//如果桶第一个节点hash==-1
            tab = helpTransfer(tab, f);//就不知道在干嘛
        else {
            V oldVal = null;
            synchronized (f) {//最后，否则，对这个桶加锁
                if (tabAt(tab, i) == f) {//如果是链表（我也不知道为什么是链表）
                    if (fh >= 0) {
                        binCount = 1;
                        for (Node<K, V> e = f; ; ++binCount) {////遍历链表？又好像不是，没看到循环的next。binCount又是为何++？记录的是链表的长度？
                            K ek;
                            if (e.hash == hash && ((ek = e.key) == key || (ek != null && key.equals(ek)))) {//节点的key的hash相等并且key相等，那就是更新
                                oldVal = e.val;//获取旧值
                                if (!onlyIfAbsent)
                                    e.val = value;//设新值
                                break;
                            }
                            Node<K, V> pred = e;
                            if ((e = e.next) == null) {//遍历到最后都还没找到就是插入
                                pred.next = new Node<K, V>(hash, key, value, null);
                                break;
                            }
                        }
                    } else if (f instanceof TreeBin) {//如果是红黑树
                        Node<K, V> p;
                        binCount = 2;
                        if ((p = ((TreeBin<K, V>) f).putTreeVal(hash, key, value)) != null) {
                            oldVal = p.val;
                            if (!onlyIfAbsent)
                                p.val = value;
                        }
                    }
                }
            }
            if (binCount != 0) {
                if (binCount >= TREEIFY_THRESHOLD)//链表太长，变成红黑树
                    treeifyBin(tab, i);
            get    if (oldVal != null)
                    return oldVal;
                break;
            }
        }
    }
    addCount(1L, binCount);
    return null;
}
```

# get操作
1. table为空或者table长度为0或者桶为空，返回null
2. 否则判断是链表还是红黑树，尝试查找

```java
public V get(Object key) {
    Node<K, V>[] tab;
    Node<K, V> e, p;
    int n, eh;
    K ek;
    int h = spread(key.hashCode());//再hash
    if ((tab = table) != null && (n = tab.length) > 0 && (e = tabAt(tab, (n - 1) & h)) != null) {//table不为空，table长度大于0，桶不为空
        if ((eh = e.hash) == h) {
            if ((ek = e.key) == key || (ek != null && key.equals(ek)))//桶的第一个节点的key的hash相等并且key相等，找到了
                return e.val;
        } else if (eh < 0)
            return (p = e.find(h, key)) != null ? p.val : null;//这是红黑树？
        while ((e = e.next) != null) {
            if (e.hash == h && ((ek = e.key) == key || (ek != null && key.equals(ek))))//遍历链表，key的hash相等并且key相等，找到了
                return e.val;
        }
    }
    return null;
}
```

# size操作
不同于1.7在size的时候才计算有多少个。1.8有个volatile的变量baseCount用来记录元素个数。在增添或者删除元素时，会调用addCount()来更新baseCount。至于代码有点复杂，看不懂。

参考文献：

[ConcurrentHashMap原理分析（1.7与1.8）](http://www.cnblogs.com/study-everyday/p/6430462.html "ConcurrentHashMap原理分析（1.7与1.8）")

[谈谈 ConcurrentHashMap 1.7 和 1.8 的不同实现](https://toutiao.io/posts/jmuhzy/preview "谈谈 ConcurrentHashMap 1.7 和 1.8 的不同实现")

[Java进阶（六）从ConcurrentHashMap的演进看Java多线程核心技术](http://www.jasongj.com/java/concurrenthashmap/ "Java进阶（六）从ConcurrentHashMap的演进看Java多线程核心技术")

[ConcurrentHashMap源码的设计与实现（1.7与1.8）](http://xawei.me/2017/06/12/ConcurrentHashMap%E6%BA%90%E7%A0%81%E7%9A%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0%EF%BC%881.7%E4%B8%8E1.8%EF%BC%89/ "ConcurrentHashMap源码的设计与实现（1.7与1.8）")
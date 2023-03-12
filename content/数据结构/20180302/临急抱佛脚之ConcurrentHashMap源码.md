---
createdAt: '2018-03-02'
updatedAt: '2018-03-02'
---

<!--more-->

HashMap是线程不安全的，在并发下容易导致Entry构成环状结构导致死循环。而HashTable虽然是线程安全的，但是他的方法都用synchronize同步。当竞争激烈时，就只有一个线程能进行操作，效率低下。HashTable的问题在于全部线程都竞争同一个锁，但是实际上各个线程所操作的数据却不一定是同一个。既然这样，那就把不同的额数据设置不同的锁，那么操作不同数据的线程之间就不会产生竞争了。这边是分段锁。

回顾一下HashMap，HashMap的核心数据变量是Entry/Node数组。既然是分段，一个长为100的Entry[]可以例如每十个一段，一共十段。但是为了代码编写方便，有必要对每“十个”Entry进行一下封装。所以，在ConcurrentHashMap里多了一个内部类叫Segment，Segment类的核心数据变量是Entry[]。这个Segment继承了ReentrantLock，方便加锁解锁。因此，ConcurrentHashMap由Segment[]组成，而Segment又由Entry[]组成，存储key-value的依然是Entry，每个桶有四种状态，为空，只有一个Entry，链表和红黑树。而到达Entry过程大致是先进行第一次hash找到对应的那个Segment。操作Segment的数据前按需获取锁。获取锁之后操作Segment，Segment内部基本上就跟HashMap一样了。

![](/file/blog/code/20180302/res.infoq.com-articles-ConcurrentHashMap-zh-resources-2.jpg.1.jpg)

# ConcurrentHashMap的大致的样子

```java
public class ConcurrentHashMap {
    final int segmentMask;
    final int segmentShift;
    //ConcurrentHashMap类里面是Segment[]，并且是final，说明Segment是不变的了，至于为什么不需要变了，下面说。但是Segment的HashEntry[]还是会扩展的
    final Segment<K,V>[] segments;
    //这根HashMap一样
    static final class HashEntry<K,V> {
        final int hash;
        final K key;
        volatile V value;
        volatile HashEntry<K,V> next;
    }
    //多了Segment类
    static final class Segment<K,V> extends ReentrantLock implements Serializable {
        //Segment类里面是HashEntry[]，是volatile，串联到get方法不需要加锁
        transient volatile HashEntry<K,V>[] table;
        transient int count;
        transient int modCount;

        transient int threshold;

        final float loadFactor;
        Segment(float lf, int threshold, HashEntry<K,V>[] tab) {
            this.loadFactor = lf;
            this.threshold = threshold;
            this.table = tab;
        }

        private void rehash(HashEntry<K,V> node) {
        }
        final V put(K key, int hash, V value, boolean onlyIfAbsent) {
        }
    }
}
```

# ConcurrentHashMap的构造函数
ConcurrentHashMap与HashMap一样，initialCapacity和loadFactor一个用来确定初始化大小，一个用来控制负荷。但是ConcurrentHashMap多了个Segment数组，所以concurrencyLevel就是用来控制Segment数组的长度的。但是他的名字叫“并发程度”，意思应该是理想化，每个线程这么巧操作的数据都在各自的Segment里，没有竞争。那么线程数（并发程度）就是要等于Segment数组的长度了。
```java
public ConcurrentHashMap(int initialCapacity,float loadFactor, int concurrencyLevel) {
    if (!(loadFactor > 0) || initialCapacity < 0 || concurrencyLevel <= 0)//不得小于0
        throw new IllegalArgumentException();
    if (concurrencyLevel > MAX_SEGMENTS)//concurrencyLevel默认16，MAX_SEGMENTS=2^16，所以Segment数组最长65536
        concurrencyLevel = MAX_SEGMENTS;
    int sshift = 0;
    int ssize = 1;
    while (ssize < concurrencyLevel) {//这里这个循环后会ssize^sshift < concurrencyLevel
        ++sshift;
        ssize <<= 1;
    }
    //下面这两个变量用来计算hash，至于为什么要这么减就不懂了
    this.segmentShift = 32 - sshift;
    this.segmentMask = ssize - 1;
    if (initialCapacity > MAXIMUM_CAPACITY)//容量不得超标
        initialCapacity = MAXIMUM_CAPACITY;
    int c = initialCapacity / ssize;//平均每个Segment至少要容纳c个
    if (c * ssize < initialCapacity)
        ++c;
    int cap = MIN_SEGMENT_TABLE_CAPACITY;
    while (cap < c)//当然c不一定是2的次方
        cap <<= 1;
    //创建一个Segment，赋值到Segment[0]里。可以发现，ConcurrentHashMap并没有成员变量保存Segment的负荷，阈值，然后竟然为了保存Segment的负荷，阈值，不得不（？）先创建一个Segment来保存，而Segment数组的其余值是延迟初始化的，下面讲到，当要new一个Segment时，Segment的负荷，阈值竟然是到第一个Segment来拿的。。。
    Segment<K,V> s0 =new Segment<K,V>(loadFactor, (int)(cap * loadFactor),(HashEntry<K,V>[])new HashEntry[cap]);
    Segment<K,V>[] ss = (Segment<K,V>[])new Segment[ssize];
    UNSAFE.putOrderedObject(ss, SBASE, s0); 
    this.segments = ss;
}
```

# ConcurrentHashMap的get
由于HashEntry的value使用volatile，所以只是get值的话，可以确保线程可见，不需要加锁。Segment[]的下标计算方法为`(((hash >>> segmentShift) & segmentMask) << SSHIFT) + SBASE`，HashEntry[]的下标计算方法为`(tab.length - 1) & hash`。
```java
Segment<K,V> s;
HashEntry<K,V>[] tab;
int h = hash(key);//计算hash
long u = (((h >>> segmentShift) & segmentMask) << SSHIFT) + SBASE;//用hash计算Segment[]的下标
if ((s = (Segment<K,V>)UNSAFE.getObjectVolatile(segments, u)) != null && (tab = s.table) != null) {//获取Segment的HashEntry[]
    for (HashEntry<K,V> e = (HashEntry<K,V>) UNSAFE.getObjectVolatile(tab, ((long)(((tab.length - 1) & h)) << TSHIFT) + TBASE); e != null; e = e.next) {//遍历桶
        K k;
        if ((k = e.key) == key || (e.hash == h && key.equals(k)))
            return e.value;
    }
}
return null;
```

# ConcurrentHashMap的put
```java
//ConcurrentHashMap的put
public V put(K key, V value) {
    Segment<K,V> s;//key对应的Segment，有则取之，无则new之
    if (value == null)
        throw new NullPointerException();
    int hash = hash(key);
    int j = (hash >>> segmentShift) & segmentMask;//这里这个j不是Segment下标，结合get方法的下标计算方法，这里只算了一半
    if ((s = (Segment<K,V>)UNSAFE.getObject(segments, (j << SSHIFT) + SBASE)) == null)//无则new之
        s = ensureSegment(j);
    return s.put(key, hash, value, false);//Segment的put
}
//new之的方法
private Segment<K,V> ensureSegment(int k) {
    final Segment<K,V>[] ss = this.segments;
    long u = (k << SSHIFT) + SBASE;//Segment计算下标剩下的那一半，为什么要分开算。。。
    Segment<K,V> seg;
    if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u)) == null) {//再看看segment为不为空
        Segment<K,V> proto = ss[0];//去segments[0]拿负荷，阈值
        int cap = proto.table.length;
        float lf = proto.loadFactor;
        int threshold = (int)(cap * lf);
        HashEntry<K,V>[] tab = (HashEntry<K,V>[])new HashEntry[cap];//new一个HashEntry<K,V>[]
        if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u)) == null) {//再再看看segment为不为空
            Segment<K,V> s = new Segment<K,V>(lf, threshold, tab);//new一个segment
            while ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u)) == null) {//用CAS方式添加
                if (UNSAFE.compareAndSwapObject(ss, u, null, seg = s))
                    break;
            }
        }
    }
    return seg;
}
//Segment的put，跟HasMap差不多，不过要获取锁
final V put(K key, int hash, V value, boolean onlyIfAbsent) {
    HashEntry<K,V> node = tryLock() ? null : scanAndLockForPut(key, hash, value);//获取锁
    V oldValue;
    try {
        HashEntry<K,V>[] tab = table;
        int index = (tab.length - 1) & hash;
        HashEntry<K,V> first = entryAt(tab, index);
        for (HashEntry<K,V> e = first;;) {
            if (e != null) {//桶有东西
                K k;
                if ((k = e.key) == key ||(e.hash == hash && key.equals(k))) {
                    oldValue = e.value;
                    if (!onlyIfAbsent) {
                        e.value = value;//覆盖源value
                        ++modCount;
                    }
                    break;
                }
                e = e.next;//否则遍历桶下去
            } else {
                if (node != null)
                    node.setNext(first);
                else
                    node = new HashEntry<K,V>(hash, key, value, first);
                int c = count + 1;
                if (c > threshold && tab.length < MAXIMUM_CAPACITY)//大于阈值并且还能扩容就扩容
                    rehash(node);
                else
                    setEntryAt(tab, index, node);
                ++modCount;
                count = c;
                oldValue = null;
                break;
            }
        }
    } finally {
        unlock();//最后释放锁
    }
    return oldValue;
}
```

# ConcurrentHashMap的Segment的rehash
ConcurrentHashMap的Segment[]是final，不能扩容的，但是ConcurrentHashMap的Segment的HashEntry[]需要扩容
```java
private void rehash(HashEntry<K,V> node) {
    HashEntry<K,V>[] oldTable = table;
    int oldCapacity = oldTable.length;
    int newCapacity = oldCapacity << 1;
    threshold = (int)(newCapacity * loadFactor);
    HashEntry<K,V>[] newTable = (HashEntry<K,V>[]) new HashEntry[newCapacity];//new个新HashEntry<K,V>[]
    int sizeMask = newCapacity - 1;
    for (int i = 0; i < oldCapacity ; i++) {//复制旧值，但是i < oldCapacity，oldTable[i]？？？？
        HashEntry<K,V> e = oldTable[i];
        if (e != null) {
            HashEntry<K,V> next = e.next;
            int idx = e.hash & sizeMask;
            if (next == null)
                newTable[idx] = e;
            else {
                HashEntry<K,V> lastRun = e;
                int lastIdx = idx;
                for (HashEntry<K,V> last = next;last != null;last = last.next) {
                    int k = last.hash & sizeMask;
                    if (k != lastIdx) {
                        lastIdx = k;
                        lastRun = last;
                    }
                }
                newTable[lastIdx] = lastRun;
                for (HashEntry<K,V> p = e; p != lastRun; p = p.next) {
                    V v = p.value;
                    int h = p.hash;
                    int k = h & sizeMask;
                    HashEntry<K,V> n = newTable[k];
                    newTable[k] = new HashEntry<K,V>(h, p.key, v, n);
                }
            }
        }
    }
    int nodeIndex = node.hash & sizeMask; // add the new node
    node.setNext(newTable[nodeIndex]);
    newTable[nodeIndex] = node;
    table = newTable;
}
```

# ConcurrentHashMap的size
ConcurrentHashMap的size并没有一个成员变量来保存，而是需要的时候才来统计。一开始统计是不加锁的，统计两次，如果第一次和第二次，各个Segment的modCount没有变（等价于各个Segment的modCount的和没有变），证明在这个过程中没有数据的插入或者删除，返回统计出来的size。如果有变，着全部Segment加锁来统计。
```java
public int size() {
    final Segment<K,V>[] segments = this.segments;
    int size;//统计结果
    boolean overflow; // true if size overflows 32 bits
    long sum;         // 第二次各个Segment的modCount的和
    long last = 0L;   // 第一次各个Segment的modCount的和
    int retries = -1; // first iteration isn't retry
    try {
        for (;;) {
            if (retries++ == RETRIES_BEFORE_LOCK) {//RETRIES_BEFORE_LOCK默认是2，即统计两次，超过两次加锁
                for (int j = 0; j < segments.length; ++j)
                    ensureSegment(j).lock();
            }
            sum = 0L;
            size = 0;
            overflow = false;
            for (int j = 0; j < segments.length; ++j) {
                Segment<K,V> seg = segmentAt(segments, j);
                if (seg != null) {
                    sum += seg.modCount;//统计中
                int c = seg.count;
                if (c < 0 || (size += c) < 0)//如果个数大于int的MAX
                    overflow = true;
                }
            }
            if (sum == last)
                break;
            last = sum;
        }
    } finally {
        if (retries > RETRIES_BEFORE_LOCK) {//解锁
            for (int j = 0; j < segments.length; ++j)
                segmentAt(segments, j).unlock();
        }
    }
    return overflow ? Integer.MAX_VALUE : size;
}
```

代码都来自于[JDK1.7ConcurrentHashMap源码分析](https://liuzhengyang.github.io/2017/05/08/concurrenthashmap/ "JDK1.7ConcurrentHashMap源码分析")，图片侵删

参考文献

[JDK1.7ConcurrentHashMap源码分析](https://liuzhengyang.github.io/2017/05/08/concurrenthashmap/ "JDK1.7ConcurrentHashMap源码分析")

[ConcurrentHashMap源码分析](https://www.jianshu.com/p/206b84d3a518 "ConcurrentHashMap源码分析")

[聊聊并发（四）——深入分析ConcurrentHashMap](http://www.infoq.com/cn/articles/ConcurrentHashMap/ "聊聊并发（四）——深入分析ConcurrentHashMap")

[ConcurrentHashMap源码分析](http://www.cnblogs.com/liaoweipeng/p/6343674.html "ConcurrentHashMap源码分析")
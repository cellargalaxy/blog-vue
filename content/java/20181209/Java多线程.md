---
createdAt: '2018-12-09'
updatedAt: '2018-12-09'
---
# 进程

## 孤儿进程与僵尸进程
子进程是由父进程创建的，linux能确保子进程结束后，父进程能通过调用wait()或者waitpid()系统调用获取到子进程的信息。
其实现方式是，当子进程结束后，虽然系统会是否子进程的大部分资源，如打开的文件，内存等，但是还是会保留少量资源，如pid，直到父进程调用获取子进程的信息才会释放。
因此，如果子进程还没结束，父进程就结束了，那这些子进程则是孤儿进程，会被init进程（pid=1）收养，以调用释放孤儿进程的资源。
但是如果子进程结束了，但他的父进程既不结束也不调用释放资源，那么这些子进程则是僵尸进程，会一直占用pid，直到系统无pid可用。

<!--more-->

# 线程

## 什么是线程安全，如何实现线程安全
个人理解，确保多个线程操作同一个数据，不会出现错误的结果或者异常，则是线程安全。
而实现线程安全的本质则是加锁。无论是synchronized，CAS，ConcurrentHasMap还是CountDownLatch来实现线程安全，其实都是锁。

## 线程的生命周期
1. 新建(New)：new了一个线程对象
2. 就绪（Runnable）：调用了start方法，但线程还没获取到CPU时间
3. 运行（Running）：线程获取到CPU时间，正在执行run方法
4. 阻塞(Blocked)：由于各种原因被阻塞（synchronized，wait，sleep，join，IO，）
5. 死亡(Dead)：线程完成run方法或者报异常

## 创建线程的方式
线程创建的方法有五种（如果线程池的两种也算的话）：
1. `继承Thread类，重写run方法`
2. `new Thread(new Runnable())`
3. `new Thread(new FutureTask(new Callable<T>()))`
4. `void execute(new Runnable())`
5. `<T> Future<T> submit(new Callable<T>())`

## 如何关闭线程
调用废弃的stop方法会立即抛出ThreadDeath异常，并释放全部的锁来停止线程。
但是这个异常可能在任何地方抛出，如果抛出的时候正在做什么操作而被强行中断，则有可能导致安全问题。
因此正确的方式应该是调用interrupt方法，我们需要在run方法的逻辑里自行判断当前线程是否被调用过interrupt方法，来自行决定是否要结束线程。
其中获取是否被调用过interrupt方法的方法有：
```java
//返回是否被调用过interrupt方法，重置中断状态
public static boolean interrupted() {
    return isInterrupted(true);
}
//返回是否被调用过interrupt方法，不重置中断状态
public boolean isInterrupted() {
    return isInterrupted(false);
}
//返回是否被调用过interrupt方法，入参含义是是否重置中断状态
private native boolean isInterrupted(boolean ClearInterrupted);

//如果在sleep，wait等方法时调用interrupt方法，会抛InterruptedException
//但抛了InterruptedException之后，会重置中断状态，因为已经通过抛异常来通知了
```

## 死锁
死锁是例如两个线程都各自持有一个锁的同时尝试去获取对方的锁，并且获取对方的锁是无条件等待的，不获取到对方的锁就不释放自己的锁的情形。
要解决死锁，【两个线程都各自持有一个锁的同时尝试去获取对方的锁】是很难避免。
因此问题的根源在于【获取对方的锁是无条件等待的】，也就是如果获取锁的超时的或者是尝试性的，总会有一方因为等不下去，回滚业务，释放自己的锁，使得另外一方获取到全部的锁。
因此可以用CAS或者Lock来替代synchronized。
```java
public class LockTest {
    private static String lock1 = "lock1";
    private static String lock2 = "lock2";

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (lock1) {
                synchronized (lock2) {
                }
            }
        }).start();
        new Thread(() -> {
            synchronized (lock2) {
                synchronized (lock1) {
                }
            }
        }).start();
    }
}
```

# 线程池

## 线程池作用
线程的创建和销毁成本很大，并且线程也不能无限制创建。所以需要线程池来预创建线程来提高响应，也限制线程数量，复用线程。

## 线程池核心参数
ThreadPoolExecutor的构造函数的入参，也是线程池的核心参数如下
```java
public ThreadPoolExecutor(
    //核心线程池数
    int corePoolSize,
    //最大线程池数
    int maximumPoolSize,
    //线程最大空闲时间与单位
    long keepAliveTime, TimeUnit unit,
    //保存任务的阻塞队列
    BlockingQueue<Runnable> workQueue,
    //线程工厂
    ThreadFactory threadFactory,
    //饱和策略
    RejectedExecutionHandler handler)
```

线程池的工作流程如下：
1. 一开始线程池是没有线程的
2. 当添加任务的时候，线程池会检查线程数是否达到核心线程数，如果没达到就创建新的线程来执行（全局锁）
3. 如果达到核心线程数，则把任务放进队列
4. 如果队列已经满了，则会检查线程数是否达到最大线程数，如果没达到就创建新的线程来执行（全局锁）
5. 如果线程数达到最大线程数，则会使用拒绝策略
6. 如果任务量下降，会把大于核心线程数的，线程空闲时间大于线程最大空闲时间的线程销毁，即最后会保留核心线程数数量的线程

阻塞队列有几种：
+ ArrayBlockingQueue：数组，有界，先进先出
+ LinkedBlockingQueue：链表，无界，先进先出（FixedThreadPool，SingleThreadExecutor）
+ SynchronousQueue：不存储元素，插入必须移除，否则阻塞（CachedThreadPool）
+ PriorityBlockingQueue：有优先级，无界

饱和策略有四种：
+ CallerRunsPolicy：当线程池没有关闭，使用添加任务的线程来执行此任务
+ DiscardPolicy：丢弃任务
+ DiscardOldestPolicy：丢弃最旧的任务，在尝试添加此任务
+ AbortPolicy：直接抛出RejectedExecutionException异常

## 创建线程池的方式
Executors类提供了好几个静态方法来创建不同类型的线程池，但是这些方法都只是返回新new的ThreadPoolExecutor对象，区别只是ThreadPoolExecutor构造函数的入参值不同
+ newFixedThreadPool(int nThreads)：线程数固定的，等待队列无界
+ newSingleThreadExecutor()：单线程，等待队列无界
+ newCachedThreadPool()：线程数自动的，等待队列为0
+ newScheduledThreadPool(int corePoolSize)：支持定时以及周期性执行任务的，等待队列无界

##  配置线程池
CPU密集型：核心线程数=CPU核数+1
IO密集型：核心线程数=CPU核数*2
阻塞队列最好有界，以触发饱和策略来预警

## 其他方法
```java
//提交任务
void execute(Runnable command);
<T> Future<T> submit(Callable<T> task);
//关闭线程池
void shutdown(); //关闭线程池，不再接受新的任务，直到现有任务都完成就完成关闭
void shutdownNow(); //关闭线程池，不再接受新的任务，现有任务的线程终止
boolean isShutdown(); //线程池是否已经关闭
```

参考文章：

[Java线程中断的正确姿势](https://www.jianshu.com/p/264d4e1b76af)

[并发编程3：线程池的使用与执行流程](https://blog.csdn.net/u011240877/article/details/73440993)

[深入分析java线程池的实现原理](https://www.jianshu.com/p/87bff5cc8d8c)
---
createdAt: '2018-03-12'
updatedAt: '2018-03-12'
---
Executor框架是自带的线程池框架。

# Executor
Executor是一个接口，只有`void execute(Runnable command);`方法。

<!--more-->

# ExecutorService
ExecutorService也是一个接口，继承Executor。但是比Executor多了些方法，例如：

`void shutdown();`：关闭线程池，不再接受新的任务，直到现有任务都完成就完成关闭

`void shutdownNow();`：关闭线程池，不再接受新的任务，现有任务的线程终止

`boolean isShutdown();`：线程池是否已经关闭

`<T> Future<T> submit(Callable<T> task);`：提交Callable任务

# Runable
向线程池提交Runable对象是用于计算没有返回的任务。

# Callable
跟Runable相识，但是Callable用于计算有返回结果的任务，返回的结果通过Future封装

# Future与FutureTask
Future是个接口，FutureTask实现了Future和Runable。FutureTask是Future唯一的实现。Future的方法例如：

`boolean cancel(boolean mayInterruptIfRunning);`：取消任务，mayInterruptIfRunning表示是否要取消正在执行但还没执行完成的任务。取消成功返回true

`isCancelled()`：任务是否已经被取消

`isDone()`：任务是否已经完成

`V get() throws InterruptedException, ExecutionException;`：获取计算结果，会阻塞直到计算完成

`V get(long timeout, TimeUnit unit) throws InterruptedException,ExecutionException,TimeoutException;`：超时版

# Executors
Executors的静态方法提供好几种现成的线程池，这些静态方法都是创建`ThreadPoolExecutor`对象的。
```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler)
```

`newFixedThreadPool(int nThreads)`：创建一个线程数固定的，等待队列无界的线程池

`newSingleThreadExecutor()`：创建一个单线程，等待队列无界的线程池

`newCachedThreadPool()`：创建一个线程数自动的，等待队列无界的线程池

`newScheduledThreadPool(int corePoolSize)`：创建支持定时以及周期性执行任务的，等待队列无界的线程池

参考文献
[Executor框架简介](https://www.jianshu.com/p/8826a459471f "Executor框架简介")
---
createdAt: '2018-12-15'
updatedAt: '2018-12-15'
---

<!--more-->

# Timer
## Timer的使用
TimerTask是单线程的，与系统时间有关，报异常后无法自动恢复的。
```java
TimerTask timerTask = new TimerTask() {
    @Override
    public void run() {
        System.out.println("TimerTask run: " + LocalDateTime.now());
    }
};

//延迟0ms，每隔1000ms执行一次
Timer timer = new Timer();
timer.schedule(timerTask, 0, 1000);
```
## Timer的源码
Timer维护着两个对象，一个是任务队列，一个是线程。Timer添加任务的方法最终都会调用其中的一个私有方法，这个方法有三个入参。任务：`task`，延迟多久执行第一次：`time`，以及执行的间隔：`period`。这里有两点要注意，第一点是Timer使用`System.currentTimeMillis()`来判断任务执行时间，所以如果电脑时间被修改了，任务的执行就会乱套了。第二点是`period`参数为正数时表示任务的以任务开始时间为间隔周期执行，为负数则是以任务结束时间为间隔周期执行，而为零这是非周期执行。Timer是线程安全的，因为它会在私有方法里获取锁。经过一轮设定，任务最后会放到任务队列里，然后调用任务队列的notify方法通知线程去任务队列里检查新任务，这也是为什么`TimerThread`的构造方法需要任务队列做入参的原因。

```java
public class Timer {
    //显然是任务队列
    private final TaskQueue queue = new TaskQueue();
    //显然是执行任务的线程
    private final TimerThread thread = new TimerThread(queue);

    //上面添加任务的方法
    public void schedule(TimerTask task, long delay, long period) {
        if (delay < 0)
            throw new IllegalArgumentException("Negative delay.");
        if (period <= 0)
            throw new IllegalArgumentException("Non-positive period.");
        sched(task, System.currentTimeMillis()+delay, -period);
    }

    //而全部添加任务的方法最终都会调用这个方法
    private void sched(TimerTask task, long time, long period) {
        if (time < 0)
            throw new IllegalArgumentException("Illegal execution time.");
        if (Math.abs(period) > (Long.MAX_VALUE >> 1))
            period >>= 1;
        synchronized(queue) {
            if (!thread.newTasksMayBeScheduled)
                throw new IllegalStateException("Timer already cancelled.");
            synchronized(task.lock) {
                if (task.state != TimerTask.VIRGIN)
                    throw new IllegalStateException(
                        "Task already scheduled or cancelled");
                task.nextExecutionTime = time;
                task.period = period;
                task.state = TimerTask.SCHEDULED;
            }
            queue.add(task);
            if (queue.getMin() == task)
                queue.notify();
        }
    }
}
```

## TaskQueue
TaskQueue就不贴代码了。TaskQueue是个队列，内部有个数组，数据结构是二叉堆，以任务的执行时间来排序。由于是数组，所以会像ArrayList一样自动扩容。为TimerThread提供获取删除最临进要执行的任务等方法。

## TimerThread的源码
```java
class TimerThread extends Thread {
   
    boolean newTasksMayBeScheduled = true;

    private TaskQueue queue;

    TimerThread(TaskQueue queue) {
        this.queue = queue;
    }

    public void run() {
        try {
            mainLoop();
        } finally {
            synchronized(queue) {
                //如果其中一个任务报了异常，整个Timer就会死亡，剩余的任务也不会被执行
                newTasksMayBeScheduled = false;
                queue.clear();  // Eliminate obsolete references
            }
        }
    }

    private void mainLoop() {
        while (true) {
            try {
                TimerTask task;
                boolean taskFired;
                synchronized(queue) {
                    //没有任务并且还没死亡就wait
                    while (queue.isEmpty() && newTasksMayBeScheduled)
                        queue.wait();
                    if (queue.isEmpty())
                        break; //死了并且任务做完了就拜拜

                    //从队列里取出最临进要执行的任务
                    //比较当前时间与任务要执行的时间
                    long currentTime, executionTime;
                    task = queue.getMin();
                    synchronized(task.lock) {
                        if (task.state == TimerTask.CANCELLED) {
                            queue.removeMin();
                            continue;  //任务取消了
                        }
                        currentTime = System.currentTimeMillis();
                        executionTime = task.nextExecutionTime;
                        //由于这里这个判断，所以只有任务在队列里
                        //即便执行时间过了，还是会认为需要执行的
                        if (taskFired = (executionTime<=currentTime)) {
                            if (task.period == 0) { //非周期执行
                                queue.removeMin();
                                task.state = TimerTask.EXECUTED;
                            } else { //周期执行，设置下次执行时间
                                queue.rescheduleMin(
                                  task.period<0 ? currentTime   - task.period
                                                : executionTime + task.period);
                            }
                        }TimerThread
                    }
                    if (!taskFired) //还没到执行时间，先wait一下
                        queue.wait(executionTime - currentTime);
                }
                if (taskFired)  //到执行时间，执行
                    task.run();
            } catch(InterruptedException e) {
            }
        }
    }
}
```

# ScheduledExecutorService
## ScheduledExecutorService的使用
```java
//十个线程
ScheduledExecutorService service = Executors.newScheduledThreadPool(10);
// 参数：1、具体执行的任务   2、首次执行的延时时间
//       3、任务执行间隔     4、间隔时间单位
service.scheduleAtFixedRate(() -> System.out.println("ScheduledExecutorService run: " + LocalDateTime.now()), 0, 3, TimeUnit.SECONDS);
    }
}
```

## ScheduledExecutorService的源码
ScheduledExecutorService通过execute或者submit提交任务，但最后都会调用schedule方法。在schedule方法里会将任务封装为RunnableScheduledFuture，然后通过delayedExecute方法加入任务队列。在delayedExecute方法里，在加入任务队列之前还会检查线程池状态等，以执行饱和策略。而任务队列使用的是内部类DelayedWorkQueue。DelayedWorkQueue是按照任务执行时间进行排序，这跟Timer的一样。
```java
public <V> ScheduledFuture<V> schedule(Callable<V> callable,
                                       long delay,
                                       TimeUnit unit) {
    if (callable == null || unit == null)
        throw new NullPointerException();
    RunnableScheduledFuture<V> t = decorateTask(callable,
        new ScheduledFutureTask<V>(callable,
                                   triggerTime(delay, unit)));
    delayedExecute(t);
    return t;
}

private void delayedExecute(RunnableScheduledFuture<?> task) {
    if (isShutdown())
        reject(task);
    else {
        super.getQueue().add(task);
        if (isShutdown() &&
            !canRunInCurrentRunState(task.isPeriodic()) &&
            remove(task))
            task.cancel(false);
        else
            ensurePrestart();
    }
}

boolean canRunInCurrentRunState(boolean periodic) {
    return isRunningOrShutdown(periodic ?
                               continueExistingPeriodicTasksAfterShutdown :
                               executeExistingDelayedTasksAfterShutdown);
}
```
当任务执行时：
```java
public void run() {
    boolean periodic = isPeriodic();
    if (!canRunInCurrentRunState(periodic))
        //无法执行，取消任务
        cancel(false);
    else if (!periodic)
        //不是周期性执行的
        ScheduledFutureTask.super.run();
    else if (ScheduledFutureTask.super.runAndReset()) {
        //周期性执行的，在if判断里执行
        //然后设置下次执行时间
        setNextRunTime();
        //放到队列里等待再次执行
        reExecutePeriodic(outerTask);
    }
}

private void setNextRunTime() {
    long p = period;
    if (p > 0)
        time += p;
    else
        time = triggerTime(-p);
}

void reExecutePeriodic(RunnableScheduledFuture<?> task) {
    if (canRunInCurrentRunState(true)) {
        super.getQueue().add(task);
        if (!canRunInCurrentRunState(true) && remove(task))
            task.cancel(false);
        else
            ensurePrestart();
    }
}
```

# spring boot的任务调度
首先是EnableScheduling注解，EnableScheduling注解只是导入了SchedulingConfiguration配置类。而SchedulingConfiguration配置类只是注册了一个ScheduledAnnotationBeanPostProcessor的bean。
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Import(SchedulingConfiguration.class)
@Documented
public @interface EnableScheduling {
}

@Configuration
public class SchedulingConfiguration {

    @Bean(name = AnnotationConfigUtils.SCHEDULED_ANNOTATION_PROCESSOR_BEAN_NAME)
    @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
    public ScheduledAnnotationBeanPostProcessor scheduledAnnotationProcessor() {
        return new ScheduledAnnotationBeanPostProcessor();
    }

}
```
而在ScheduledAnnotationBeanPostProcessor中，不知为何大家说会调用其中的postProcessAfterInitialization方法。postProcessAfterInitialization方法会遍历全部需要任务调度的方法，塞到processScheduled方法里。processScheduled方法会根据任务的类型，即周期还是cron，添加到registrar对象里。而registrar对象是ScheduledTaskRegistrar类。ScheduledTaskRegistrar里面有个成员变量TaskScheduler。最终任务会被添加到TaskScheduler里。TaskScheduler只是个接口，实现类是ConcurrentTaskScheduler。ConcurrentTaskScheduler又有个成员变量ScheduledExecutorService。而ConcurrentTaskScheduler的这个ScheduledExecutorService是通过`Executors.newSingleThreadScheduledExecutor()`方法来创建的。而newSingleThreadScheduledExecutor方法默认是单线程。然后相信之后大家都懂的了。（真TM绕）
```java
@Override
public Object postProcessAfterInitialization(final Object bean, String beanName) {
    //。。。
    for (Map.Entry<Method, Set<Scheduled>> entry : annotatedMethods.entrySet()) {
        Method method = entry.getKey();
        for (Scheduled scheduled : entry.getValue()) {
            processScheduled(scheduled, method, bean);
        }
    }
    //。。。
    return bean;
}

protected void processScheduled(Scheduled scheduled, Method method, Object bean) {   
    //获取corn类型
    String cron = scheduled.cron();
    if (StringUtils.hasText(cron)) {
    Assert.isTrue(initialDelay == -1, "'initialDelay' not supported for cron triggers");
    processedSchedule = true;
    String zone = scheduled.zone();
    //放入cron任务列表中（不执行）
    this.registrar.addCronTask(new CronTask(runnable, new CronTrigger(cron, timeZone)));
    }
    //执行频率类型（long类型）
    long fixedRate = scheduled.fixedRate();
    String fixedDelayString = scheduled.fixedDelayString();
    if (fixedRate >= 0) {
    Assert.isTrue(!processedSchedule, errorMessage);
    processedSchedule = true;
    //放入FixedRate任务列表中（不执行）（registrar为ScheduledTaskRegistrar）
    this.registrar.addFixedRateTask(new IntervalTask(runnable, fixedRate, initialDelay));
    }
    //执行频率类型（字符串类型，不接收参数计算如：600*20）
    String fixedRateString = scheduled.fixedRateString();
    if (StringUtils.hasText(fixedRateString)) {
    Assert.isTrue(!processedSchedule, errorMessage);
    processedSchedule = true;
    if (this.embeddedValueResolver != null) {
        fixedRateString = this.embeddedValueResolver.resolveStringValue(fixedRateString);
    }
    fixedRate = Long.parseLong(fixedRateString);
    //放入FixedRate任务列表中（不执行）
    this.registrar.addFixedRateTask(new IntervalTask(runnable, fixedRate, initialDelay));
    }
    return bean;
}

public class Executors {
    public static ScheduledExecutorService newSingleThreadScheduledExecutor() {
        return new DelegatedScheduledExecutorService(new ScheduledThreadPoolExecutor(1));
    }
}
```

在spring boot里，为了并发执行任务，一般有两种方法。一是使用`@Async`注解跟`@Scheduled`注解一起用。二是实现SchedulingConfigurer接口，重写configureTasks方法
```java
@Configuration
public class ScheduleConfig implements SchedulingConfigurer {
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.setScheduler(Executors.newScheduledThreadPool(10));
    }
}
```

# 定时任务执行时间过长的策略

参考文章：

[一起来学 SpringBoot 2.x | 第十六篇：定时任务详解](http://www.iocoder.cn/Spring-Boot/battcn/v2-other-scheduling/)

[Java 定时器 Timer 源码分析和使用建议](https://www.jianshu.com/p/e3967ed84c2b)

[分析Java延迟与周期任务的实现原理](https://www.jianshu.com/p/d96e9f67dba5)

[spring源码分析之定时任务Scheduled注解](https://www.cnblogs.com/davidwang456/p/5680088.html)

[springBoot中@Scheduled执行原理解析](https://blog.csdn.net/gaodebao1/article/details/51789225)
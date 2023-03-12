---
createdAt: '2018-10-24'
updatedAt: '2018-10-24'
---

<!--more-->

# Quartz框架的主要类

Quartz框架有四个主要类/接口：Scheduler(任务调度器)、Job(任务)、JobDetail和Trigger(触发器)。分别用于调度任务，定义业务逻辑，业务逻辑执行实例和触发条件。这里可能搞不清的是Job和JobDetail。Job用于定义与框架和执行方式无关业务逻辑。而JobDetail除了保护Job的业务逻辑以外，还保护这个业务逻辑所处理的数据。因此，一个Job的业务逻辑可以被用于不同数据的JobDetail上，即Job和JobDetail是一对多的关系。而JobDetail与Trigger一一对应。Scheduler监控全部的Trigger来决定是否要执行某个JobDetail。

## Job与JobDetail

Job是个接口，只有一个叫execute的方法。业务逻辑需要我们实现Job写在这个方法里。除了运行时异常，这个方法只允许抛JobExecutionException。这个异常会让Quartz做出不同的异常处理策略，下面会说到。execute方法还有个入参JobExecutionContext。这个对象最重要的是能通过getMergedJobDataMap方法，获取一个JobDataMap对象。JobDataMap实现了Map，能获取外部传入的数据，以利于业务逻辑进行处理。并且，这些数据也能通过setter方法让Quartz注入。Job默认是无状态的。给Job添加@DisallowConcurrentExecution注解会让Job变成单例。而@PersistJobDataAfterExecution注解则会更新JobDetail的JobDataMap中存储的数据。

```java
/**
 * @author cellargalaxy
 * @time 2018/10/23
 */
public class HelloJob implements Job {
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        System.out.println("任务开始执行");
        JobDataMap jobDataMap = context.getMergedJobDataMap();
        for (Map.Entry<String, Object> entry : jobDataMap.entrySet()) {
            System.out.println(entry.getKey() + " : " + entry.getValue());
        }
        System.out.println("任务执行完成");
    }
}
```

而JobDetail的使用则是下面这样。首先需要绑定使用哪个Job的class。然后在withIdentity方法里设定这个JobDetail的名字和组名。以便于以后对这个JobDetail进行查询获取其他操作。也可以通过usingJobData方法给Job里的业务逻辑传递数据。

```java
JobDetail jobDetail = org.quartz.JobBuilder.newJob(HelloJob.class)
    .withIdentity("myJob", "group1")
    .usingJobData("iKey", "iValue")
    .build();
```

## Trigger
Trigger用于指定JobDetail的执行时间。可以设定一个优先级priority，用于当多个任务的触发时间相同，但资源不够的时候先触发那些任务。常用的有两种。

SimpleTrigger用于间隔一段时间来重复执行。
```java
Trigger trigger = newTrigger()
    .withIdentity("trigger3", "group1")//名字和组名
    .startAt(myTimeToStartFiring)//开始执行的时间，当然也有结束时间可以设定
    .withSchedule(simpleSchedule()
        .withIntervalInSeconds(10)//每隔十秒
        .withRepeatCount(10))//重复十次，永远用repeatForever方法
    .usingJobData("yKey", "yValue")//Trigger也可以给Job传递数据
    .build();
```

CronTrigger则通过指定cron来执行。
```java
Trigger trigger = newTrigger()
    .withIdentity("trigger3", "group1")//名字和组名
    .withSchedule(cronSchedule("0 42 10 * * ?"))//指定cron
    .usingJobData("yKey", "yValue")//Trigger也可以给Job传递数据
    .build();
```

## Scheduler

Scheduler由他的工程类SchedulerFactory创建。常用的是StdScheduler。

```java
SchedulerFactory schedulerFactory = new StdSchedulerFactory();
Scheduler scheduler = schedulerFactory.getScheduler();

JobDetail jobDetail = null;
Trigger trigger = null;

//添加任务
scheduler.scheduleJob(jobDetail, trigger);
//调用start之后任务才会开始执行
scheduler.start();
//直到调用shutdown
scheduler.shutdown();
```

# 激活失败处理策略
可以在配置文件quartz.properties里设定一个参数misfireThreshold，单位毫秒。当一个任务由于各种原因（调度器被关闭/线程不够）无法在指定时间执行，Quartz最多等待misfireThreshold毫秒，如果还是等不到机会执行，则判为激活失败。

激活失败的处理策略对于不同的Scheduler略有不同。全部Scheduler的默认使用MISFIRE_INSTRUCTION_SMART_POLICY，即“聪明策略”。这个聪明策略的策略是：
```
如果任务不重复执行：
    MISFIRE_INSTRUCTION_FIRE_NOW
如果任务永远执行：
    MISFIRE_INSTRUCTION_RESCHEDULE_NEXT_WITH_REMAINING_COUNT
如果任务重复执行且有限：
    MISFIRE_INSTRUCTION_RESCHEDULE_NOW_WITH_EXISTING_REPEAT_COUNT
```

SimpleTrigger的策略：
```
MISFIRE_INSTRUCTION_FIRE_NOW 立即执行

MISFIRE_INSTRUCTION_RESCHEDULE_NEXT_WITH_REMAINING_COUNT 下一个执行点开始执行，过期作废
MISFIRE_INSTRUCTION_RESCHEDULE_NOW_WITH_REMAINING_COUNT 立即执行，过期作废

MISFIRE_INSTRUCTION_RESCHEDULE_NEXT_WITH_EXISTING_COUNT 下一个执行点开始执行，并重复到指定的次数
MISFIRE_INSTRUCTION_RESCHEDULE_NOW_WITH_EXISTING_COUNT 立即执行，并重复到指定的次数

MISFIRE_INSTRUCTION_IGNORE_MISFIRE_POLICY 过期作废，按策略执行
```

CronTrigger的策略：
```
MISFIRE_INSTRUCTION_FIRE_ONCE_NOW 立即执行，然后按计划执行
MISFIRE_INSTRUCTION_DO_NOTHING 目前不执行，然后按计划执行
```

# 异常处理

异常的处理能够通过抛出的JobExecutionException的方法来设置。
```java
//捕获异常，立即重新执行任务
try {
    
} catch (Exception e) {
    JobExecutionException e2 = new JobExecutionException(e);
    //立即重新执行任务
    e2.setRefireImmediately(true);
    throw e2;
}
//捕获异常，取消全部任务
try {
    
} catch (Exception e) {
    JobExecutionException e2 = new JobExecutionException(e);
    //取消全部跟这个Job有关的trigger，避免再执行这个trigger
    e2.setUnscheduleAllTriggers(true);
    throw e2;
}
```

参考文献：

[作业调度系统—Quarzt](https://xuzongbao.gitbooks.io/quartz/content/)

[Quartz的misfire处理机制分析](https://www.cnblogs.com/pzy4447/p/5201674.html)

[Quartz 2 定时任务（三）：异常与中断处理](https://segmentfault.com/a/1190000009141079)
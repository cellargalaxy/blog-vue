---
createdAt: '2018-07-05'
updatedAt: '2018-07-05'
---

<!--more-->

实习之后好久没有写东西了，摸个鱼~~~

Quarzt是一个做定时任务的框架，能在指定的开始时间，结束时间，循环次数，间隔时间，或者是cron表达式来执行指定的定时任务。

首先是一个简单例子：

```java
import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author cellargalaxy
 * @time 2018/7/4
 */
public class HelloJob implements Job {
    private final DateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
    private int value2;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        JobDetail jobDetail = jobExecutionContext.getJobDetail();
        JobKey jobKey = jobDetail.getKey();
        JobDataMap jobDataMap = jobDetail.getJobDataMap();
        String value1 = jobDataMap.getString("value1");
        System.out.println();
        System.out.println("jobKey: "+jobKey);
        System.out.println("通过JobDataMap获取的参数value1: " + value1);
        System.out.println("通过setter获取的参数value2: " + value2);
        System.out.println("现在时间是：" + dateFormat.format(new Date()));
        System.out.println();
    }

    public void setValue2(int value2) {
        this.value2 = value2;
    }

    public static void main(String[] args) throws SchedulerException, InterruptedException {
        //创建主类Scheduler
        SchedulerFactory schedulerFactory = new StdSchedulerFactory();
        Scheduler scheduler = schedulerFactory.getScheduler();

        //定时任务和其他参数
        JobDetail jobDetail = JobBuilder.newJob(HelloJob.class)
                .withIdentity("jobName", "groupName")
                .usingJobData("value1", "Hello World!")
                .usingJobData("value2", 654321)
                .build();

        //定时任务的执行时间
        Date runTime = new Date(System.currentTimeMillis() + 1000 * 2);
        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("triggerName", "groupName")
                .startAt(runTime)
                .build();

        //添加某某任务，在某某时间执行
        scheduler.scheduleJob(jobDetail, trigger);

        //开始全部定时任务执行，等6秒钟，结束全部定时任务执行
        scheduler.start();
        Thread.sleep(1000 * 4);
        scheduler.shutdown();
    }
}
```
首先是`Job`接口，只有一个方法`execute(JobExecutionContext jobExecutionContext) throws JobExecutionException`。使用方法是实现Job接口，然后把定时任务的任务逻辑在execute方法里。就像`HelloJob`类的任务是打印一下时间。

之后看main方法里的`Scheduler`接口，Scheduler是框架的主类，由他的工厂类`SchedulerFactory`进行创建。通过Scheduler我们可以增删查改定时的任务`JobDetail`和其执行时间`Trigger`。

`JobDetail`是接口，通过`JobBuilder`来构建。保存的是定时任务所要执行的Job实现类的class对象，估计通过反射调用。以及设定任务的一些参数。这些参数可以通过setter方法让Quarzt自动注入，也可以通过execute方法的`JobExecutionContext`对象的`JobDataMap`对象获取。JobDataMap实现了Map，还有很多其他方便的方法。JobExecutionContext对象还能获取到例如`JobKey`对象，保存了此任务的组名和任务名。

`Trigger`接口叫触发器，用来定义任务的执行时间。跟JobDetail一样，是使用`TriggerBuilder`来构建的。其实现类常用有两个，一个是`SimpleTriggerImpl`，另一个是`CronTriggerImpl`。SimpleTriggerImpl用来执行每隔x秒执行一次类型，CronTriggerImpl就是通过cron来定义执行时间了。因此，TriggerBuilder的构建入参花样较多，不同构造参数，他会自动返回不同的实现（这不就是builder的意义所在吗）。接下来举例一些TriggerBuilder的参数填法。

```java
//立即开始，每个一秒执行一次，十秒后结束
public static final Trigger example1() {
    return TriggerBuilder.newTrigger()
            .withIdentity("triggerName1", "groupName1")
            //.startAt() //不设定开始时间即立即开始
            .withSchedule(
                    SimpleScheduleBuilder
                            .simpleSchedule()
                            .withIntervalInSeconds(1)//间隔一秒钟
                            .repeatForever()//永远重复
            )
            .endAt(new Date(System.currentTimeMillis() + 1000 * 10)) //不设定结束时间即永不结束
            .build();
}

//立即开始，每个一秒执行一次，永不结束
public static final Trigger example2() {
    return TriggerBuilder.newTrigger()
            .withIdentity("triggerName", "groupName")
            .withSchedule(CronScheduleBuilder.cronSchedule("/1 * * * * ?"))
            .build();
}

//每天10:42执行
public static final Trigger example3() {
    return TriggerBuilder.newTrigger()
            .withIdentity("triggerName", "groupName")
            .withSchedule(CronScheduleBuilder.dailyAtHourAndMinute(10, 42))
            .build();
}
```

参考文献：

[Quartz中文文档](https://legacy.gitbook.com/book/xuzongbao/quartz/details "Quartz中文文档")
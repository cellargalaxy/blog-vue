---
createdAt: '2018-10-24'
updatedAt: '2018-10-24'
---
我们需要Quartz框架执行任务，就需要告诉Quartz所需的JobDetail和Trigger。在单机里，Quartz会把JobDetail和Trigger保存在内存里，如果重启，JobDetail和Trigger的数据都会全部丢失（虽然会在代码里重新添加）。显然，需要集群执行，把JobDetail和Trigger保存在内存里是没有办法在各个节点之间进行同步的，而Quartz利用数据库的锁来进行实现。

<!--more-->

# JobStore

JobStore负责跟踪调度器的全部工作，常见有三种：RAMJobStore把数据都保存在内存里，效率最高，也是默认的。JDBCJobStore通过JDBC把数据都保存在数据库里。但是貌似要把JobDetail和Trigger保存在数据库里，比较常用的是JobStoreTx。要使用JDBCJobStore或者JobStoreTx，需要在配置文件里配置：
```
org.quartz.jobStore.class = org.quartz.simpl.RAMJobStore
#或者
org.quartz.jobStore.class = org.quartz.impl.jdbcjobstore.JobStoreTX
```

# SpringBoot结合Quartz集群
[SpringBoot结合Quartz集群](https://www.jianshu.com/p/9facdd9d758d)

# Quartz集群原理及源码分析

首先用户获得的是一个Scheduler接口，常用实现类为StdScheduler。但其实StdScheduler基本上是个代理类，代理的是QuartzScheduler类。
```java
public class QuartzScheduler implements RemotableQuartzScheduler {
    //资源管理类，用于管理线程池（默认实现是SimpleThreadPool），JobStore等
    private QuartzSchedulerResources resources;
    //同于处理任务调度
    private QuartzSchedulerThread schedThread;
    ...
    //Job的监听器
    private HashMap<String, JobListener> internalJobListeners = new HashMap<String, JobListener>(10);
    //Trigger的监听器
    private HashMap<String, TriggerListener> internalTriggerListeners = new HashMap<String, TriggerListener>(10);
    //Scheduler的监听器
    private ArrayList<SchedulerListener> internalSchedulerListeners = new ArrayList<SchedulerListener>(10);
    ...
}
```

而QuartzSchedulerThread的run方法是调度的主循环方法。可以猜测调用acquireNextTriggers方法需要在保证同步的情况下找到并激活trigger
```java
public class QuartzScheduler implements RemotableQuartzScheduler {
    public void run() {
        ...
        while (!halted.get()) {
            ...
            
            //调度器在trigger队列中寻找30秒内一定数目的trigger(需要保证集群节点的系统时间一致)
            triggers = qsRsrcs.getJobStore().acquireNextTriggers(
                now + idleWaitTime, Math.min(availThreadCount, qsRsrcs.getMaxBatchSize()), qsRsrcs.getBatchTimeWindow());

            ...

            //触发trigger
            List<TriggerFiredResult> res = qsRsrcs.getJobStore().triggersFired(triggers);

            ...

            //释放trigger
            for (int i = 0; i < triggers.size(); i++) {
                qsRsrcs.getJobStore().releaseAcquiredTrigger(triggers.get(i));
            }
        }             
    }
}
```

所调用的acquireNextTriggers方法是JobStore接口的。因为我们在配置文件里配置使用JobStoreTX这个实现类。JobStoreTX继承于JobStoreSupport这个抽象类。而acquireNextTriggers方法，JobStoreTX并没有重写JobStoreSupport，所以实际的实现是在JobStoreSupport里。然后最后调用的是executeInNonManagedTXLock方法。

```java
public abstract class JobStoreSupport implements JobStore, Constants {
    public List<OperableTrigger> acquireNextTriggers(final long noLaterThan, final int maxCount, final long timeWindow) throws JobPersistenceException {
        ...
        return executeInNonManagedTXLock(lockName, ...);
    }
    
    protected <T> T executeInNonManagedTXLock( String lockName,   TransactionCallback<T> txCallback, final TransactionValidator<T> txValidator) throws JobPersistenceException {
        try {
            if (lockName != null) {
                ...
                //获取锁
                transOwner = getLockHandler().obtainLock(conn, lockName);
            }
            
            if (conn == null) {
                conn = getNonManagedTXConnection();
            }
            
            final T result = txCallback.execute(conn);
            try {
                commitConnection(conn);
            } catch (JobPersistenceException e) {
                ...
            }

            return result;
        } catch (JobPersistenceException e) {
            rollbackConnection(conn);
            throw e;
        } catch (RuntimeException e) {
            rollbackConnection(conn);
            throw new JobPersistenceException("Unexpected runtime exception: "
                    + e.getMessage(), e);
        } finally {
            try {
                releaseLock(lockName, transOwner);//释放锁
            } finally {
                cleanupConnection(conn);
            }
        }
    }
}
```

在上面的getLockHandler().obtainLock(conn, lockName);里，调用的是Semaphore接口的obtainLock方法。Semaphore只有三个方法。其最后的实现StdRowLockSemaphore类。
```java
public interface Semaphore {
    boolean obtainLock(Connection conn, String lockName) throws LockException;

    void releaseLock(String lockName) throws LockException;

    boolean requiresConnection();
}

public class StdRowLockSemaphore extends DBSemaphore {
    public static final String SELECT_FOR_LOCK = "SELECT * FROM "
            + TABLE_PREFIX_SUBST + TABLE_LOCKS + " WHERE " + COL_SCHEDULER_NAME + " = " + SCHED_NAME_SUBST
            + " AND " + COL_LOCK_NAME + " = ? FOR UPDATE";

    public static final String INSERT_LOCK = "INSERT INTO "
        + TABLE_PREFIX_SUBST + TABLE_LOCKS + "(" + COL_SCHEDULER_NAME + ", " + COL_LOCK_NAME + ") VALUES (" 
        + SCHED_NAME_SUBST + ", ?)"; 
        
    //指定锁定SQL
    protected void executeSQL(Connection conn, String lockName, String expandedSQL) throws LockException {
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            ps = conn.prepareStatement(expandedSQL);
            ps.setString(1, lockName);
            ...
            rs = ps.executeQuery();
            if (!rs.next()) {
                throw new SQLException(Util.rtp(
                    "No row exists in table " + TABLE_PREFIX_SUBST +
                    TABLE_LOCKS + " for lock named: " + lockName, getTablePrefix()));
            }
        } catch (SQLException sqle) {
            ...
        } finally {
            ...
        }
      }
    }

    //获取QRTZ_LOCKS行级锁
    public boolean obtainLock(Connection conn, String lockName) throws LockException {
        lockName = lockName.intern();

        if (!isLockOwner(conn, lockName)) {
            executeSQL(conn, lockName, expandedSQL);
            getThreadLocks().add(lockName);
        }
        return true;
    }

    //释放QRTZ_LOCKS行级锁
    public void releaseLock(Connection conn, String lockName) {
        lockName = lockName.intern();
        if (isLockOwner(conn, lockName)) {
            getThreadLocks().remove(lockName);
        }
        ......
    }
}
```

# 结论
Quartz集群同步机制是在一个事务里通过select语句里添加for update，添加行锁、悲观锁来实现的。没有获取到锁的将会被阻塞，直到获取了锁的提交事务。当然，达到这种效果的前提是需要把Connection设置为手动提交，即autoCommit为false。

参考文献：

[Quartz应用与集群原理分析](https://tech.meituan.com/mt_crm_quartz.html)
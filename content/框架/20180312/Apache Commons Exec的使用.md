---
createdAt: '2018-03-12'
updatedAt: '2018-03-12'
---
Apache Commons Exec是用来执行系统命令的，用来代替`Runtime.exec()`的包。[官方首页](https://commons.apache.org/proper/commons-exec/index.html "官方首页")

假设我们需要在java中使用`AcroRd32.exe`来打印出一个pdf文件。

<!--more-->

# 简单使用
```java
String line = "AcroRd32.exe /p /h " + file.getAbsolutePath();//拼凑出命令语句
CommandLine cmdLine = CommandLine.parse(line);//封装为命令对象
DefaultExecutor executor = new DefaultExecutor();//创建一个命令的执行器
int exitValue = executor.execute(cmdLine);//执行器执行命令，返回离开值
```
执行以上代码好像是会报错的，原因在于离开值。不是很懂离开值这东西，貌似默认如果程序正常完成，会返回0给执行器，否则执行器就认为命令执行失败，会报异常。但是`AcroRd32.exe`即使是正常完成，离开值却返回1，所以我们需要修改执行器的成功的离开值
```java
String line = "AcroRd32.exe /p /h " + file.getAbsolutePath();
CommandLine cmdLine = CommandLine.parse(line);
DefaultExecutor executor = new DefaultExecutor();
executor.setExitValue(1);//把成功执行的离开值修改为1
int exitValue = executor.execute(cmdLine);
```
# 监控狗
创建一个监控狗对象并设置到执行器里，可以使得命令在指定时间内返回，避免程序因为出现异常情况，长时间不返回。当然是返回而不是执行完成，更不是执行成功。在指定时间内命令没有执行完成会应该被杀死，避免长时间占用系统资源。
```java
String line = "AcroRd32.exe /p /h " + file.getAbsolutePath();
CommandLine cmdLine = CommandLine.parse(line);
DefaultExecutor executor = new DefaultExecutor();
executor.setExitValue(1);
ExecuteWatchdog watchdog = new ExecuteWatchdog(60000);//创建一个监控狗对象，指定在60000ms内返回
executor.setWatchdog(watchdog);//给执行器设置监控狗
int exitValue = executor.execute(cmdLine);
```

# 构建命令对象
上面的命令对象是通过字符串拼凑参数创建的，命令的参数我们可以不通过字符串拼凑的方法，而是向命令对象设置的方法添加。
```java
CommandLine cmdLine = new CommandLine("AcroRd32.exe");//由于参数是另外添加的，所以只需要"AcroRd32.exe"即可
cmdLine.addArgument("/p");//添加/p参数
cmdLine.addArgument("/h");//添加/h参数
cmdLine.addArgument("${file}");//给文件对象留个空位，再在map里加载
Map map = new HashMap();//一个用来存放参数的map
map.put("file", new File("invoice.pdf"));//文件的参数对
cmdLine.setSubstitutionMap(map);//向命令对象添加参数对的map
DefaultExecutor executor = new DefaultExecutor();
executor.setExitValue(1);
ExecuteWatchdog watchdog = new ExecuteWatchdog(60000);
executor.setWatchdog(watchdog);
int exitValue = executor.execute(cmdLine);
```

# 并发执行
在执行`executor.execute(cmdLine)`方法时是阻塞的，即我们需要等命令执行完成或者到监控狗指定的时间后，才能继续执行下语句代码。如果命令需要执行好久，或者任务很多，这样子串行执行效率就会很低。因此可以创建一个`DefaultExecuteResultHandler`对象，实现并发执行。
```java
CommandLine cmdLine = new CommandLine("AcroRd32.exe");
cmdLine.addArgument("/p");
cmdLine.addArgument("/h");
cmdLine.addArgument("${file}");
HashMap map = new HashMap();
map.put("file", new File("invoice.pdf"));
commandLine.setSubstitutionMap(map);

//创建一个DefaultExecuteResultHandler对象
DefaultExecuteResultHandler resultHandler = new DefaultExecuteResultHandler();

ExecuteWatchdog watchdog = new ExecuteWatchdog(60*1000);
Executor executor = new DefaultExecutor();
executor.setExitValue(1);
executor.setWatchdog(watchdog);
executor.execute(cmdLine, resultHandler);//在执行方法添加DefaultExecuteResultHandler对象，这样方法就不会阻塞了

int exitValue = resultHandler.waitFor();//waitFor方法会阻塞直到命令执行完成或者到监控狗指定的时间
```

参考文献
[https://commons.apache.org/proper/commons-exec/tutorial.html](https://commons.apache.org/proper/commons-exec/tutorial.html)
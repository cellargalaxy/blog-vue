## 添加分析

排查工具我用的是PProf。

对于web服务的使用，可以对外暴露一个端口拉取分析。

使用go自带的web服务

```go
package main

import (
  _ "net/http/pprof"
  "http"
)

func main() {
  _ = http.ListenAndServe(":6060", nil)
}
```

使用gin的话，可以使用`github.com/gin-contrib/pprof`包

```go
package main

import (
  "github.com/gin-contrib/pprof"
  "github.com/gin-gonic/gin"
)

func main() {
  engine := gin.Default()
  debug := engine.Group("/debug")
  pprof.RouteRegister(debug, "/pprof")

  _ = engine.Run(":6060")
}
```

## 分析类型

这时候打开 `http://127.0.0.1:6060/debug/pprof/` 应该就能看到分析页面

```
/debug/pprof/

Types of profiles available:
Count Profile
342   allocs
0     block
0     cmdline
18    goroutine
342   heap
0     mutex
0     profile
17    threadcreate
0     trace
full goroutine stack dump
```

下面还有一些分析指标的说明

+ allocs：过去分配过的内存分析
+ block：导致阻塞的堆栈
+ cmdline：程序的命令行完整执行调用路径
+ goroutine：当前所有的协程情况
+ heap：当前内存分配情况
+ mutex：当前导致互斥锁竞争的持有者堆栈情况
+ profile：默认30s的CPU的profile
+ threadcreate：查看新创建的OS线程堆栈情况

## 分析可视化

可以通过终端交互查看，但还是推荐网页可视化比较省心。

使用网页可视化前需要安装`graphviz`来渲染页面。

使用命令下载并渲染分析，xxx就是上面的某种分析类型。之后后会自动打开浏览器。

```shell
go tool pprof -http=:6061 http://localhost:6060/debug/pprof/xxx
```

## 可视化的菜单

`view`里有不同的可视化方式，分别是

+ Top：会罗列各个方法的资源消耗，点一下可以排序
  + flat：方法自身的资源消耗
  + flat%：方法自身的资源消耗占比
  + sum%：排序后的累加的资源消耗占比
  + cum：方法及其所调用的方法的资源消耗总和
  + cum%：方法及其所调用的方法的资源消耗总和占比
  + Name：方法名
+ Graph：一个方法调用关系图，框越大消耗越大。第一行是包名，第二行是方法名，第三行是flat+flat%，第四行是cum+cum%
+ Flame Graph：火焰图，方法的cum可视化图形
+ Peek：相比top，增加了方法的调用者和被调用者
+ Source：可以看到源代码，对源代码基本进行分析

如果是选择了内存的指标，`simple`里可以进一步对内存做进一步的过滤

+ alloc_objects：方法的历史内存对象数量
+ alloc_space：方法的历史内存分配大小
+ inuse_objects：方法的当前内存对象数量
+ inuse_space：方法的当前内存分配大小

## 原因分析

这里简单看heap的top，在去看看Graph。

```
Flat      Flat%    Sum%	   Cum         Cum%    Name Inlined?
9728.45kB  37.33%  37.33%  9728.45kB   37.33%  context.WithValue	
5120.08kB  19.65%  56.98%  14848.52kB  56.98%  github.com/cellargalaxy/go_common/util.SetCtxValue	(inline)
2562.81kB  9.84%   66.82%  2562.81kB   9.84%   runtime.allocm	
2560.04kB  9.82%   76.64%  17408.56kB  66.81%  github.com/cellargalaxy/go_common/util.ResetLogId	
2449.92kB  9.40%   86.04%  2961.94kB   11.37%  modernc.org/libc/honnef.co/go/netdb.init.0	
561.50kB   2.15%   88.20%  17970.06kB  68.96%  github.com/cellargalaxy/server_center/sdk.flushEvent	
...
```

包含的对象内存最大头的调用链路是`flushEvent->ResetLogId->SetCtxValue->WithValue`。

他没有直接告诉我那个对象站内存大。一开始我是没看懂，想不明白。

后来想啊想啊，想到了我代码里有这么一段代码。

```go
package main

import (
  "context"
)

func flushEvent(ctx context.Context) {
  for {
    ctx = ResetLogId(ctx)
    flush(ctx)
  }
}
func flush(ctx context.Context) {
  //do something
}
func ResetLogId(ctx context.Context) context.Context {
  //省略SetCtxValue的逻辑
  return context.WithValue(ctx, "xxx", "yyy")
}
```

`context.Context`不是一个map，每次for循环给ctx加值，值会一直累加，不会释放。

给ctx加的值不大，并且for循环频率不高，所以内存增值是比较缓慢的，符合事件观察的现象。

参考文献

https://golang2.eddycjy.com/posts/ch6/01-pprof-1/

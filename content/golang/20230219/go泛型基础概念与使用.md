1.18的时候，泛型就已经正式支持了，现在golang的版本都到1.20了。
自己还没怎么了解过，也没怎么用过，就特意 ~~（应付公司分享）~~ 翻了一下网上的文档学习一下。

## GO泛型的使用

例如我们需要写一个，对整形或者浮点比较大小的函数，在不使用泛型的情况下，得写两个函数。
可以看到这两个函数实际代码一模一样，因为入参的类型不同，而不得不重复写，显然并不优雅。

```go
package main

func MinInt32(a, b int32) int32 {
  if a < b {
    return a
  }
  return b
}
func MinFloat64(a, b float64) float64 {
  if a < b {
    return a
  }
  return b
}

// 也可以简写为：func MinInt32OrFloat64[T int | float64](a, b T) T {
func MinInt32OrFloat64[T interface{ int32 | float64 }](a, b T) T {
  if a < b {
    return a
  }
  return b
}

func main() {
  MinInt32(1, 2)
  MinFloat64(1.1, 2.2)

  MinInt32OrFloat64[int32](1, 2) //使用中括号指定类型实参
  MinInt32OrFloat64(1.1, 2.2)    //自动进行类型推导
  //MinInt32OrFloat64(1, 2.2)      //default type float64 of 2.2 does not match inferred type int for T
  //MinInt32OrFloat64(1, 2)        //int does not implement interface{int32|float64} (int missing in int32 | float64)
  MinInt32OrFloat64(1, int32(2)) //显式指定其中一个入参的类型

  minIntFunc := MinInt32OrFloat64[int32] //类型实例化
  minIntFunc(1, 2)
}

//泛型的使用不仅可以用在函数里，也可以用在其他类型和方法里。
type Slice[T int | string] []T

type Map[K int | string, V float32 | float64] map[K]V

type Tree[T interface{}] struct {
  left, right *Tree[T]
  value       T
}

func (t *Tree[T]) Find(x T) *Tree[T] {
  //...
  return nil
}
```

使用泛型的话，需要在入参前，使用中括号定义一个泛型类型`T`。
后面的`interface{ int32 | float64 }`，表示`T`可以是`int32`或者`float64`。
调用函数的时候，使用中括号指定泛型的实际类型，称之为**实例化**。
其中，实例化的过程分为两步进行。

1. 编译器会将泛型函数或者类型里的类型形参，替换为类型实参
2. 编译器会检查类型实参是不是满足约束

例如经过实例化后的`minIntFunc`，能像`MinInt32`一样使用。

## 类型集

在1.18之前，`interface`代表的是一组接口的集合。在引入泛型之后，给`interface`的能力做了拓展。
`interface`除了是一组接口的集合，还是一直类型的集合。

```go
package main

type Value interface {
  int | float64
}

//func MinInt32OrFloat64[T interface{ int | float64 }](a, b T) T {
func MinInt32OrFloat64[T Value](a, b T) T {
  if a <= b {
    return a
  }
  return b
}
```

例如下面这个例子，按我自己理解。

+ 在1.18之前，`X`有一个叫`a()`的接口，`Q`和`P`实现了。但`Q`，`P`，`X`三种的类型之间并没有什么关系
+ 在1.18之后，`X`有一个叫`a()`的接口，`Q`和`P`实现了。并且`X`还有一个类型集合，这个类型集合里包含了`Q`和`P`

概念虽然不一样，但是实际写起来还是一样的。

```go
package main

type X interface {
  a()
}

type Q struct{}

func (this Q) a() {}
func (this Q) b() {}

type P struct{}

func (this P) a() {}
func (this P) c() {}

type Value interface {
  X
}

func MinInt32OrFloat64[T Value](a T) {
  //...
}

func main() {
  MinInt32OrFloat64(Q{})
  MinInt32OrFloat64(P{})
}
```

### 类型集的语法

+ `T | K`：前后可以接基础类型或者类型集，会取并集
+ `~T`：表示底层的数据类型需要是`T`，所以后面直接接基础数据类型
+ `any`：新加的一个标识符，其实就是`interface{}`
+ 谷歌的`constrains`包里提供了一些常用的类型集

```go
package main

import (
  "golang.org/x/exp/constraints"
)

func Min[T constraints.Ordered](a, b T) T {
  if a < b {
    return a
  }
  return b
}

type Ordered interface {
  Integer | Float | ~string
}
type Float interface {
  ~float32 | ~float64
}
```

---

参考文章

https://www.liwenzhou.com/posts/Go/generics/


---
createdAt: '2020-07-14'
updatedAt: '2020-07-14'
---

<!--more-->

# Spring Bean Scope

spring bean的作用域范围最常用的是单例和原型，使用`@Scope("prototype")`指定即可。

+ **singleton(单例)**：spring的scope默认是单例
+ **prototype(原型)**：每一次对该bean的请求都会创建一个新的实例
+ request：http请求每次都会创建一个新的实例
+ session：http请求每个新的session都会创建一个新的实例

# Spring Bean生命周期
spring只会帮我们去管理单例的bean的整个生命周期。
对于原型的bean，spring在走完创建的流程，交给使用者后，bean的后续生命周期的流程就交由使用者进行管理了。

所以下图的spring对单例的整个生命周期的管理。
图中的`调用xx类的yy方法`是指此bean实现了此接口才会调用。
对于要自己管理对象的生命周期的话，除了第四步bean本来就在自己手上，其余的方法都是要自己调用的。
所以常用的主要就是一下这几点。

1. spring负责调用构造函数创建对象
2. spring负责注入依赖bean
3. spring负责调用我们自定义的bean的初始化函数（如果有）
4. spring负责注入bean，把bean交到使用者手上
5. spring负责在容器关闭时调用我们自定义的bean的销毁函数（如果有）

![](/file/blog/code/20200714/i.loli.net-2019-05-08-5cd1d7d0416f5.jpg.JPEG)

# Spring循环依赖
spring的循环依赖问题是指几个bean直接相互引用，例如A引用B，B又引用A，或者直接是A引用自己。
spring的依赖注入有三种入口：构造函数注入，成员变量注入和setter注入。
而spring只能解决单例的成员变量或者setter注入问题。
首先，无论bean的作用域是哪种，构造函数注入的循环应用都是无解的。
而对于作用域是原型的，则无论哪种注入方式也都是无解的。
因为例如A1引用B1，B1又引用A2，A2->B2，如此反复无穷无尽也。
所以对于以上无解情形spring检测出来会抛异常，而有解的只有单例的成员变量和setter注入。
spring循环依赖的解决办法是通过三个map做bean的缓存实现的。

```java
/** 单例池：存放初始化好的bean，拿出来就能用 */
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<String, Object>(256);

/** 存放用于创建[还没创建的]bean的工厂对象 */
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<String, ObjectFactory<?>>(16);

/** 早期引用：存放还没初始化完成的bean */
private final Map<String, Object> earlySingletonObjects = new HashMap<String, Object>(16);
```

例如下图的AB互相引用的例子

1. 从singletonObjects里检查A是不是已经初始化完成，是的话则返回
2. 否则创建A，将A封装到A工厂里，放到工厂map
3. 初始化A，发现A依赖B
4. 从singletonObjects里检查B是不是已经初始化完成，是的话则返回
5. 否则创建B，将B封装到B工厂里，放到工厂map
6. 初始化B，发现B依赖A
7. 发现A在工厂map里，将A移到早期引用map里，工厂map移除A工厂
8. B在早期引用注入A，B完成初始化
9. A在单例池注入B，A完成初始化

![](/file/blog/code/20200714/bijeuubd5z.gif)

参考文章：

[Spring bean scope 的几种类型](https://blog.csdn.net/pange1991/article/details/81429393)

[Spring Bean 生命周期](https://crossoverjie.top/2018/03/21/spring/spring-bean-lifecycle/)

[深究Spring中Bean的生命周期](https://www.javazhiyin.com/37577.html)

[Spring IOC 容器源码分析 - 循环依赖的解决办法](http://www.tianxiaobo.com/2018/06/08/Spring-IOC-%E5%AE%B9%E5%99%A8%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90-%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96%E7%9A%84%E8%A7%A3%E5%86%B3%E5%8A%9E%E6%B3%95/)

[拜托，别再问我Spring循环依赖了，给你手写出来行不行？](https://cloud.tencent.com/developer/article/1632576)
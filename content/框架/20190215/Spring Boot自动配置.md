---
createdAt: '2019-02-15'
updatedAt: '2019-02-15'
---

<!--more-->

# 条件化配置
spring4开始提供了一个新注解`@Conditional`，使得spring能够根据条件，决定是否要初始化某一个bean。`@Conditional`注解需要传入一个实现了`Condition`接口的class对象。`Condition`接口也很简单，只有一个方法，返回boolean表示是否要初始化这个bean。
```java
class MyCondition implements Condition{
    public final boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        Environment env = context.getEnvironment();
        //是否存在叫ENV_CN的环境变量
        return env.containProperty("ENV_CN");
    }
}

@Bean
@Conditional(MyCondition.class)
public ServiceBean serviceBean(){
    return new ServiceBean();
}
```

使用`@Conditional`注解需要自己去实现`Condition`接口，而spring也提供了一些能直接使用的注解
```java
@ConditionalOnBean
@ConditionalOnClass
@ConditionalOnExpression
@ConditionalOnMissingBean
@ConditionalOnMissingClass
@ConditionalOnNotWebApplication
```

# Spring Boot的自动配置
Spring Boot的自动配置的自动配置正是利用了`@Conditional`注解实现的。Spring Boot的入口类使用`@SpringBootApplication`注解声明，`@SpringBootApplication`主要是集成了`@SpringBootConfiguration`，`@EnableAutoConfiguration`和`@ComponentScan`三个注解。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
        @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
    // 略
}
```

其中实现自动配置的是`@EnableAutoConfiguration`注解，`@EnableAutoConfiguration`使用`@Import`注解导入了一个名叫`AutoConfigurationImportSelector`的类。与`@EnableAutoConfiguration`类似，Spring Boot还有几个Enable开头的注解，也是利用`@Import`。

`@EnableScheduling`是通过@Import将Spring调度框架相关的bean定义都加载到IoC容器。
`@EnableMBeanExport`是通过@Import将JMX相关的bean定义加载到IoC容器。
`@EnableAutoConfiguration`也是借助@Import的帮助，将所有符合自动配置条件的bean定义加载到IoC容器。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    //略
}
```

而`AutoConfigurationImportSelector`类则会读取ClassPath下面的`META-INF/spring.factories`文件。这个文件是一个key=value的配置文件，AutoConfigurationImportSelector会读取里面的`org.springframework.boot.autoconfigure.EnableAutoConfiguration`的值。其值全是一些bean的配置类的全限定名。最后，这些类将使用`@Conditional`或者其他注解，根据条件自动加载bean，实现Spring Boot的自动配置。

```
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
org.springframework.boot.autoconfigure.admin.SpringApplicationAdminJmxAutoConfiguration,\
org.springframework.boot.autoconfigure.aop.AopAutoConfiguration,\
org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration,\
org.springframework.boot.autoconfigure.batch.BatchAutoConfiguration,\
org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration,\
org.springframework.boot.autoconfigure.cassandra.CassandraAutoConfiguration,\
org.springframework.boot.autoconfigure.cloud.CloudAutoConfiguration,\
......
org.springframework.boot.autoconfigure.webservices.WebServicesAutoConfiguration
```


参考文章：

[Spring Boot的自动配置](https://www.hollischuang.com/archives/1791)

[Spring Boot 2.0 自动配置原理浅析](https://www.bysocket.com/?p=2001)

[第5章 Spring Boot自动配置原理](https://www.jianshu.com/p/346cac67bfcc)

[Spring Boot自动配置的"魔法"是如何实现的？](https://sylvanassun.github.io/2018/01/08/2018-01-08-spring_boot_auto_configure/)
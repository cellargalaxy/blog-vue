---
createdAt: '2018-05-16'
updatedAt: '2018-05-16'
---
# 注解是什么
注解用的多了，但是其实注解是什么。打个比喻，注解就是一张标签纸，上面写着若干信息，用来标记解释被贴上这张标签纸的事物.而其事物的性质并没有发生改变，无论这张标签纸上的解释是否正确。因此，使用注解是非入侵代码的。

# 元注解
元注解也是注解，不过是特殊的，用来标注其他注解的注解，就像Object是全部类的父类一样。比喻的说，就是标签纸A上可以贴标签纸B，标签纸B可以贴标签纸C……，最后的标签纸N就是元注解。元注解有五个：@Retention、@Target、@Inherited、@Documented、@Repeatable。

<!--more-->

` @Retention`标注此注解的保留时间，有三个值：

1. `@Retention(RetentionPolicy.SOURCE)`：表示注解只在源代码里，编译后就没了
2. `@Retention(RetentionPolicy.CLASS)`：表示编译会保留，但是不会被加载到jvm里
3. `@Retention(RetentionPolicy.RUNTIME)`：表示保留到程序运行时，程序运行时能够获取此注解

`@Target`标注此注解的使用地方，这些地方有好几个：

1. `@Target(ElementType.ANNOTATION_TYPE)`：此注解可以标注别的注解
2. `@Target(ElementType.CONSTRUCTOR)`：可以给构造方法标注
3. `@Target(ElementType.FIELD)`：可以给属性标注
4. `@Target(ElementType.LOCAL_VARIABLE)`：可以给局部变量标注
5. `@Target(ElementType.METHOD)`：可以给方法标注
6. `@Target(ElementType.PACKAGE)`：可以给一个包标注
7. `@Target(ElementType.PARAMETER)`：可以给一个方法内的参数标注
8. `@Target( ElementType.TYPE)`：可以给一个类型进行注解，比如类、接口、枚举

`@Inherited`是继承的意思。但是不是注解之间的继承，而是被注解的东西可以继承这个注解。例如@TestAnnotation注解标注了类A，类B继承了类A，但是类B没有被任何注解应用，那么类B继承了类A的@TestAnnotation注解

`@Documented`与文档有关，被标注的东西会被加到javadoc里

`@Repeatable`是可重复的意思，java8才加进来。不是很理解，借用别人的例子：一个人他既是程序员又是产品经理,同时他还是个画家。那么就可以在类SuperMan上面加三个@Person注解。@Persons注解用来存放数据。在@Person注解的@Repeatable注解里指定Persons.class。
```java
@interface Persons {
    Person[]  value();
}

@Repeatable(Persons.class)
@interface Person{
    String role default "";
}

@Person(role="artist")
@Person(role="coder")
@Person(role="PM")
public class SuperMan{

}
```

# 注解的属性
要定义一个注解很简单，有点像接口那样，接口的关键字interface前面要加个@。注解只有属性，没有方法。但是注解的属性的定义很像方法。例如`int id();`定义了一个名字叫做id的int类型的属性。也可以没有属性。
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TestAnnotation {
    int id();
    String msg();
}
```

# 注解的使用
```java
@TestAnnotation(id=1,msg="info")
public class A{}

//如果注解只有一个属性，并且属性名字叫做value，则可以省略属性名
@TestAnnotation("info")
public class A{}

//如果注解没有属性，则可以去掉括号
@TestAnnotation
public class A{}
```

# 注解值的提取
注解值的提取离不开反射。反射中的Class，Field，Method等都有相应的方法获取其注解
```java
public static void main(String[] args) {
    Class clazz=A.class;
    //是否有此注解
    boolean hasAnnotation = clazz.isAnnotationPresent(TestAnnotation.class);
    if (hasAnnotation) {
        //获取@TestAnnotation注解
        TestAnnotation testAnnotation = clazz.getAnnotation(TestAnnotation.class);
        //虽说是属性，但还是像方法一样调用获取
        System.out.println("id:"+testAnnotation.id());
        System.out.println("msg:"+testAnnotation.msg());
    }
}
```

参考文章：

[秒懂，Java 注解 （Annotation）你可以这样学](https://blog.csdn.net/briblue/article/details/73824058 "秒懂，Java 注解 （Annotation）你可以这样学")
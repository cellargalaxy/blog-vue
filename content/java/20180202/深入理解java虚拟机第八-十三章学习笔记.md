---
createdAt: '2018-02-02'
updatedAt: '2018-02-02'
---

<!--more-->

# 栈帧
栈帧是虚拟机栈的栈元素，栈帧储存了方法的局部变量表，操作数栈，动态链接和方法返回地址。对于活动的线程来说，只有在栈顶的栈帧才是有效的，这个栈帧成为当前栈帧，而当前栈帧对于的方法成为当前方法。

## 局部变量表
用来存储方法参数和方法的局部变量，局部变量表需要多大在编译的时候以及确定。局部变量表的容量以变量槽（slot）为最小单位。一般32位处理器slot大小为32位，64的则是64。为了节省栈空间，slot是可以重复利用。当某个方法的局部变量已经死亡，并且有新的变量定义，在进行GC时就可能被回收重复利用。因此有了对不再使用的变量手动设置为null的说法。与类变量有两次赋值过程不同（第一次在准备阶段赋零值，第二次在初始化阶段赋代码指定值），局部变量没有代码指定值是无法使用的。

## 操作数栈
如果说虚拟机栈是方法的栈，那操作数栈就是运算的栈。例如iadd字节码指令将操作数栈中栈顶两个数取出相加之后放回操作数栈里。

## 动态连接
不是很理解，书上说是每个栈帧都包括一个指向运行时常量池中的该帧所属的方法引用，持有这个引用是为了支持方法调用过程中的动态连接。

## 方法返回地址
这个小点感觉书并没有直接说明方法返回地址究竟是什么。倒是说了方法返回的两种情况，一种是遇到返回的字节码指令，如果有的话会把返回值返回给调用者，另一种是遇到异常，不会返回任何值给调用者。

# 方法调用
方法调用不等于方法执行。方法调用唯一要做的是确定执行的方法版本。

# 解析
由于java的多态，所以有些方法的版本不到运行的时候是不知道是那个版本。当然也有些方法在运行前就能确定运行的版本，例如静态方法，私有方法，实例构造器，父类方法和终态方法。这些方法称为非虚方法，会在类加载的时候把符号解析引用解析直接引用，其余方法称为虚方法。

# 分派
## 静态分派
没有代码说不清，与重载有关，按书上一样举个栗子
```java
//静态分派演示
public class Test{
    static abstract class Human{}
    static class Man extends Human{}
    static class Woman extends Human{}
    
    public void say(Human human){ System.out.println("human say"); }
    public void say(Man man){ System.out.println("man say"); }
    public void say(Woman woman){ System.out.println("woman say"); }
    
    public static void main(String[] args){
        Human man=new Man();
        Human woman=new Woman();
        Test t=new Test();
        t.say(man);
        t.say(woman);
    }
}
```
结果两个都是`human say`。对于`Human man=new Man();`，向上转型为`Human`是叫做静态类型，而它实际的类型`Man`就叫做实际类型。静态分派就是根据变量的静态类型来分派方法版本。在这里，即是由于`new Man()`和`new Woman()`都向上转型为`Human`，所以就分派到`say(Human human)`了。

书上还举例了一个变态的例子
```java
public class Test{
    public static void say(char a){ System.out.println("char say"); }
    public static void say(int a){ System.out.println("int say"); }
    public static void say(long a){ System.out.println("long say"); }
    public static void say(Character a){ System.out.println("Character say"); }
    public static void say(Serializable a){ System.out.println("Serializable say"); }
    public static void say(Object a){ System.out.println("Object say"); }
    public static void say(char... a){ System.out.println("char... say"); }
    
    public static void main(String[] args){
        say('a');
    }
}
```
这里say方法进行了多次恶心的重载，这种情况选择那个版本的方法并不是一个唯一答案，而是一个最适合的答案。这里几个方法以及按适合程度排序，就是注释掉第一个方法将会选择第二个方法。在全部方法里，显然char是最适合的，任何变动都不需要，其次是int，char可以转为int，，如果int没有了，int就变长long，显然是尽量可以是基础变量就转为其他的基础变量，基础变量会以char>int>long>float>double方向转型。基础变量的方法都注释掉以后，就不得不自动装箱为Character，Character也没有就转为Character的接口Serializable，Serializable也注释就Object，最后变长参数是等级最低的。

# 动态分派
动态分派对应重写，例如son类继承鱼her类，并且重写了say方法，应该选择father类的say方法版本还是son的问题。显然这里选择方法版本的依据跟静态分派不一样，用的是实际类型，对象是哪个实际类型就用哪个实际类型类的版本。

在动态分派中，为了优化性能，会在类的方法区中建立一个叫虚方法表的对象，这个表记录这这个类的虚方法是版本。如果子类没有重写父类的某个方法，那子类的虚方法表的这个方法指向的就是父类的方法版本，重写了才会指向新的自己的方法版本。

# 单分派与多分派
举栗子
```java
public class Test{
    static class QQ{}
    static class _360{}
    
    public static class Father{
        public void choice(QQ qq){ System.out.println("Father choice QQ"); }
        public void choice(_360 args){ System.out.println("Father choice 360"); }
    }
    public static class Son extends Father{
        public void choice(QQ qq){ System.out.println("Son choice QQ"); }
        public void choice(_360 args){ System.out.println("Son choice 360"); }
    }
    
    public static void main(String[] args){
        Father father=new Father();
        Father son=new Son();
        father.choice(new _360());
        son.choice(new QQ());
    }
}
```
结果
```
Father choice 360
Son choice QQ
```
这里同时涉及静态分派和动态分派，既然动态分派只能在运行时确定，那虚拟机先做了能做的静态分派。第一是根据对象的静态类型做判断，既然两个对象都向上转型为`Father`了，那后面两个choice方法都是`Father`的。第二是根据方法的参数判断，显然`father.choice(new _360());`是`choice(QQ qq)`，`son.choice(new QQ());`就是`choice(_360 args)`，完成静态分派。由于这里既要判断方法调用类又要判断方法参数，所以这里叫多分派。之后是动态分派，由于在静态分派的时候方法的参数已经确定，不需要再考虑，所以这里只需要根据对象的实际类型考虑是`Father`版的choice方法还是`son`的。因为这里只考虑类的版本，所以这里是单分派。
```java
package jvm;

import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodType;

import static java.lang.invoke.MethodHandles.lookup;

/**
 * Created by cellargalaxy on 18-2-2.
 */
public class MethodHandleTest {
    static class Print{
        public void println(String string){
            System.out.println(string);
        }
    }
    
    private static MethodHandle getPrintlnMH(Object object) throws NoSuchMethodException, IllegalAccessException {
        MethodType methodType=MethodType.methodType(void.class,String.class);
        return lookup().findVirtual(object.getClass(),"println",methodType).bindTo(object);
    }
    
    public static void main(String[] args) throws Throwable {
        Object object=new Print();
        getPrintlnMH(object).invokeExact("aaaaa");
    }
}
```
不知道为何报错
```java
Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.VerifyError: (class: jvm/MethodHandleTest, method: main signature: ([Ljava/lang/String;)V) Incompatible argument to function
    at java.lang.Class.getDeclaredMethods0(Native Method)
    at java.lang.Class.privateGetDeclaredMethods(Class.java:2701)
    at java.lang.Class.privateGetMethodRecursive(Class.java:3048)
    at java.lang.Class.getMethod0(Class.java:3018)
    at java.lang.Class.getMethod(Class.java:1784)
    at sun.launcher.LauncherHelper.validateMainClass(LauncherHelper.java:544)
    at sun.launcher.LauncherHelper.checkAndLoadMain(LauncherHelper.java:526)
```
第九章类加载及执行子系统的案例与实战跳过

# java的伪泛型
C#中的泛型被成为真实泛型，因为C#无论是在源码中，编译后，还是运行中，`List<int>`与`List<String>`是两种不同的类型。而java的泛型只存在于源代码中，编译后都是`List<Object>`，返回的时候他帮你强制转型，如
```java
//源代码
public static void main(String[] args){
    Map<String,String> map=new HashMap<String,String>();
    map.put("key","value");
    System.out.println(map.get("key"));
}
//编译后其实是
public static void main(String[] args){
    Map map=new HashMap();
    map.put("key","value");
    System.out.println((String)map.get("key"));
}
```

# 解释器与编译器
在部分商用虚拟机中，java程序最初是通过解释器来执行的，当虚拟机发现某些代码执行特别频繁，这些代码就会被认为是热点代码（Hot Spot Code）。为了提高效率，就会将热点代码编译成机器码，并且通过多种方法来优化。完成这个编译任务的编译器叫做即时编译器（Just In Time Compiler，JIT）。由于编译器在java虚拟机规范中并没有规定一定要有，所以各个虚拟机的编译器都不尽相同。HotSpot虚拟机有两个编译器，一个是Client编译器，另一个是Server编译器。client负责稳健的优化编译，编译速度较快，server负责激进的优化编译，编译速度较慢。虚拟机里的解释器与编译器相互搭配，解释器能使程序尽快启动，编译器能提高执行效率，当编译器的激进优化假设不成立时，可以将解释器作为逃生门，退回解释状态，称为逆优化。

# 编译对象与触发条件
被编译的对象有两种，一种是被多次调用的方法，第二种是被多次执行的循环体。多少次才叫多次呢？有两种数次数的方法。第一种叫基于采样的热点探测，看名字就知道，是通过统计学采样的方法估计次数，当然由于是采样估计，并不是那么准确。第二种是HotSpot使用的，叫基于计数器的热点探测，也就是每调用一次就加一。确定了计数规则，这对应方法和循环体两种编译对象，有方法调用计数器和回边计数器。

触发流程是，当进入入口，会先检查有没有编译好的版本，如果有就要编译版，没有的话对方法调用计数器或者回边计数器加一，如果加一之后两个计数器的和达到阈值（虚拟机有默认阈值），则向JIT提交编译，编译是并行的，所以然后以解释方式继续执行代码。

# 编译优化技术
## 公共子表达式消除
就是如果有两个地方都要计算`a+b`，并且这两个地方之间a和b的值并没有改变，那就只算一次`a+b`，后面两个`a+b`的地方直接使用算出来的`a+b`的值

## 数组边界消除
java对数组进行访问时，如array[i]，会检查是不是`i>-1&&i<array.length`，如果不满足就抱数组越界。但是编译期间确定确实不会数组越界，就可以不检查是不是越界了，提高效率。

## 方法内联
A方法调用B方法，就需要在虚拟机栈建A的栈帧和B的栈帧。方法内联就是把B方法的代码整合到A方法里，就只需要创建A方法的栈帧。

## 逃逸分析
逃逸分析是分析对象的动态作用域。当一个对象在方法内部定义后，如果会被方法外部引用，叫做方法逃逸。如果对象在某个线程被创建，却能被其他线程引用，叫做线程逃逸。如果不会方法逃逸，这个对象可以虚拟机栈里分配，这样子对象就可以随方法结束而销毁。如果对象不会线程逃逸，则可以取消这个对象的同步。如果一个对象不会被外部访问，这个对象可能不会被创建，取而代之的是创建这个对象的变量。以直接使用这个对象的变量来代替对象。

第十二章java内存模型与线程和第十三章线程安全与锁优化以后在java并发的笔记里再写。
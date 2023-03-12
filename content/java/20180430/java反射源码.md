---
createdAt: '2018-04-30'
updatedAt: '2018-04-30'
---
# Method对象
既然是java的反射，就躲不开class对象。class对象保存着对应的Method，Field，Constructor。接下来以Method为例~~（因为我只看了Method）~~。

不知为何，可能是为了安全把，class并不会直接暴露Method，这个Method对象叫做root对象。而是当需要获取这个rootMethod时，再new一个Method代理这个rootMethod。因此每次获取的Method对象都是新的对象。

<!--more-->

```java
//例如class的getDeclaredMethod方法
public Method getDeclaredMethod(String name, Class<?>... parameterTypes) throws NoSuchMethodException, SecurityException {
    checkMemberAccess(Member.DECLARED, Reflection.getCallerClass(), true);
        //查找rootMethod对象
        Method method = searchMethods(privateGetDeclaredMethods(false), name, parameterTypes);
        if (method == null) {
            throw new NoSuchMethodException(getName() + "." + name + argumentTypesToString(parameterTypes));
        }
    return method;
}

//其中的searchMethods方法
private static Method searchMethods(Method[] methods, String name, Class<?>[] parameterTypes) {
    Method res = null;
    String internedName = name.intern();
    //遍历全部rootMethod查找
    for (int i = 0; i < methods.length; i++) {
        Method m = methods[i];
        if (m.getName() == internedName
            && arrayContentsEq(parameterTypes, m.getParameterTypes())
            && (res == null
            || res.getReturnType().isAssignableFrom(m.getReturnType())))
        res = m;
    }
    //找到了就调用ReflectionFactory的copyMethod方法复制一个
    return (res == null ? res : getReflectionFactory().copyMethod(res));
}

//ReflectionFactory的copyMethod方法调用LangReflectAccess接口的copyMethod方法。
//而LangReflectAccess接口的实现类ReflectAccess中，则是调用Method的copy方法。
Method copy() {
    if (this.root != null)
    throw new IllegalArgumentException("Can not copy a non-root Method");

    Method res = new Method(clazz, name, parameterTypes, returnType, exceptionTypes, modifiers, slot, signature, annotations, parameterAnnotations, annotationDefault);//明显是new一个
    res.root = this;
    res.methodAccessor = methodAccessor;
    return res;
}
```

# Method对象的invoke方法
我们可以看到Method对象的invoke方法并不是完全自己实现的，而是交给MethodAccessor来执行。methodAccessor的创建时延时初始化，侧面说明这个是个重量级对象，网上的文章也是这么说。因为每次获取method对象都是新new一个，但是为了避免对此创建methodAccessor这种重量级对象，所以全部method对象都拥有同一个methodAccessor对象。
```java
public Object invoke(Object obj, Object... args) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException {
    if (!override) {
        if (!Reflection.quickCheckMemberAccess(clazz, modifiers)) {
            Class<?> caller = Reflection.getCallerClass();
            checkAccess(caller, clazz, obj, modifiers);
        }
    }
    MethodAccessor ma = methodAccessor;//获取成员变量methodAccessor
    if (ma == null) {
        ma = acquireMethodAccessor();//如果是空就初始化一下
    }
    return ma.invoke(obj, args);//交给MethodAccessor来执行
}
```

# ReflectionFactory工厂类
MethodAccessor是一个接口，其实现类有两个，一个是NativeMethodAccessorImpl，看名字就知道使用了本地方法，，因此还有使用java实现的一个版本，但是是哪个类我并不理解。另一个是DelegatingMethodAccessorImpl，但只是个代理类。NativeMethodAccessorImpl初始启动快，但是由于使用了本地方法，虚拟机没办法对代码进行优化。而java版初始启动慢，但是用了java代码，虚拟机可以进行优化。为了结合这两个实现的有点，这里使用了叫inflation的方法（网上是这么叫的）。即默认前十五次使用NativeMethodAccessorImpl，后面使用java版。当然也可以选择不使用inflation。创建MethodAccessor接口对象的是ReflectionFactory工厂类。
```java
//ReflectionFactory里的两个静态变量
private static boolean noInflation = false;//是否使用inflation
private static int inflationThreshold = 15;//inflation的阈值

//ReflectionFactory里创建MethodAccessor的方法
public MethodAccessor newMethodAccessor(Method var1) {
    checkInitted();
    //不使用inflation就直接java实现方法
    if(noInflation && !ReflectUtil.isVMAnonymousClass(var1.getDeclaringClass())) {
        //这我也不知道是什么类，反正应该就是java的实现类
        return (new MethodAccessorGenerator()).generateMethod(
            var1.getDeclaringClass(), var1.getName(), var1.getParameterTypes(), 
            var1.getReturnType(), var1.getExceptionTypes(), var1.getModifiers());
    } else {
        //否则使用inflation
        //注意这里创建的NativeMethodAccessorImpl对象和DelegatingMethodAccessorImpl对象都是相互持有对方的引用
        NativeMethodAccessorImpl var2 = new NativeMethodAccessorImpl(var1);
        DelegatingMethodAccessorImpl var3 = new DelegatingMethodAccessorImpl(var2);
        var2.setParent(var3);
        return var3;
    }
}

//只看懂了对noInflation和inflationThreshold值的初始化，貌似这两个值可以在虚拟机启动是设置
private static void checkInitted() {
    if(!initted) {
        AccessController.doPrivileged(new PrivilegedAction<Void>() {
            public Void run() {
                if(System.out == null) {
                    return null;
                } else {
                    String var1 = System.getProperty("sun.reflect.noInflation");
                    if(var1 != null && var1.equals("true")) {
                    ReflectionFactory.noInflation = true;
                }

                var1 = System.getProperty("sun.reflect.inflationThreshold");
                if(var1 != null) {
                    try {
                        ReflectionFactory.inflationThreshold = Integer.parseInt(var1);
                    } catch (NumberFormatException var3) {
                        throw new RuntimeException("Unable to parse property sun.reflect.inflationThreshold", var3);
                    }
                }

                ReflectionFactory.initted = true;
                return null;
                }
            }
        });
    }
}
```

# MethodAccessor接口
最绕就是NativeMethodAccessorImpl类的invoke方法了。结合ReflectionFactory工厂类的newMethodAccessor方法，返回的是DelegatingMethodAccessorImpl。DelegatingMethodAccessorImpl一开始调用的是它代理的NativeMethodAccessorImpl。在NativeMethodAccessorImpl代码里，当调用次数超过ReflectionFactory的inflationThreshold时，NativeMethodAccessorImpl又会把DelegatingMethodAccessorImpl的MethodAccessor引用修改了java版的MethodAccessor。
```
    ↓一开始引用关系
DelegatingMethodAccessorImpl ⇄ 引用 ⇄ NativeMethodAccessorImpl
    ↓一开始调用关系
外界 → 调用 → DelegatingMethodAccessorImpl → 调用 → NativeMethodAccessorImpl
    ↓检查
调用次数是否超过inflationThreshold
    ↓超过inflationThreshold
NativeMethodAccessorImpl修改DelegatingMethodAccessorImpl的引用为java版
    ↓引用关系变成
DelegatingMethodAccessorImpl → 引用 → java版
    ↓调用关系变成
外界 → 调用 → DelegatingMethodAccessorImpl → 调用 → java版
```

```java
//DelegatingMethodAccessorImpl
class DelegatingMethodAccessorImpl extends MethodAccessorImpl {
    private MethodAccessorImpl delegate;

    DelegatingMethodAccessorImpl(MethodAccessorImpl var1) {
        this.setDelegate(var1);
    }

    public Object invoke(Object var1, Object[] var2) throws IllegalArgumentException, InvocationTargetException {
        return this.delegate.invoke(var1, var2);//其实DelegatingMethodAccessorImpl自己没有任何实现，只不过是交给了别人，是个代理类
    }

    void setDelegate(MethodAccessorImpl var1) {
        this.delegate = var1;
    }
}
//NativeMethodAccessorImpl
class NativeMethodAccessorImpl extends MethodAccessorImpl {
    private final Method method;
    private DelegatingMethodAccessorImpl parent;
    private int numInvocations;

    NativeMethodAccessorImpl(Method var1) {
        this.method = var1;
    }

    public Object invoke(Object var1, Object[] var2) throws IllegalArgumentException, InvocationTargetException {
        if(++this.numInvocations > ReflectionFactory.inflationThreshold() && 
            !ReflectUtil.isVMAnonymousClass(this.method.getDeclaringClass())) {
            //超过inflationThreshold，创建java版
            MethodAccessorImpl var3 = (MethodAccessorImpl)(new MethodAccessorGenerator())
            .generateMethod(this.method.getDeclaringClass(), this.method.getName(), 
            this.method.getParameterTypes(), this.method.getReturnType(), 
            this.method.getExceptionTypes(), this.method.getModifiers());
            
            this.parent.setDelegate(var3);//修改引用，然后自己就被丢弃了
        }

        return invoke0(this.method, var1, var2);
    }

    void setParent(DelegatingMethodAccessorImpl var1) {
        this.parent = var1;
    }

    private static native Object invoke0(Method var0, Object var1, Object[] var2);//本地方法实现
}
```

参考文献：

[关于反射调用方法的一个log](http://rednaxelafx.iteye.com/blog/548536 "关于反射调用方法的一个log")

[大白话说Java反射：入门、使用、原理](https://www.cnblogs.com/chanshuyi/p/head_first_of_reflection.html "大白话说Java反射：入门、使用、原理")

[深入分析Java方法反射的实现原理](http://www.importnew.com/23902.html "深入分析Java方法反射的实现原理")

[Java反射原理简析](http://www.fanyilun.me/2015/10/29/Java%E5%8F%8D%E5%B0%84%E5%8E%9F%E7%90%86/ "Java反射原理简析")
---
createdAt: '2018-08-09'
updatedAt: '2018-08-09'
---
之前一直只会使用`@RunWith(SpringRunner.class)`和`@SpringBootTest`注解来加载整个项目来注入依赖，就只会用个`assertEquals`方法来进行测试（虽然现在也是）。但问题还是有的，且不论加载整个项目，把无关的依赖都加载进行，浪费时间。如果我要测试添加用户的接口，第一，一测试就把数据写进数据库了呀，即便是测试数据库，不要紧，那我测试第二遍，由于账户名相同，就写不进去数据库了，不能接受地报了错，其实啥问题都没有，如果要再测试就得改账户名，动了代码。也就是说这样的测试代码是连调用两次都不行的垃圾，这样子不是很奇怪吗。

而Mockito能解决这些问题。先说说情景，我要对`UserService`类测试添加账号和获取账号的方法，UserService调用了`UserDao`的方法，为了避免我调用UserService的时候调用到真的，连接到数据库的UserDao，我需要给UserService替换一个UserDao的实现，而这个新的UserDao的实现的方法的返回我希望我能简单直观的控制，这样就叫做对UserService类mock了UserDao。

在spring boot里使用很简单，下面是个简单例子，`UserPo`类就是个普通的bean，放着账号密码，就不贴代码了。

<!--more-->

```java
package top.cellargalaxy.mycloud.service;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import top.cellargalaxy.mycloud.dao.UserDao;
import top.cellargalaxy.mycloud.model.bo.UserBo;
import top.cellargalaxy.mycloud.model.po.UserPo;
import top.cellargalaxy.mycloud.model.query.UserQuery;
import top.cellargalaxy.mycloud.service.impl.UserServiceImpl;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class UserServiceTest {
    //@InjectMocks标注被测试的对象
    @InjectMocks
    private UserService userService = new UserServiceImpl();
    
    //@Mock标注需要被注入到被测试对象的依赖
    @Mock
    private UserDao userDao;

    @Before
    public void setUp() {
        //初始化测试用例类中由Mockito的注解标注的所有模拟对象
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void addUser() {
        //每调用userDao的insert方法时都返回1，表示插入成功
        when(userDao.insert(any(UserPo.class)))
                .thenReturn(1);
        
        //userService做了插入的时候，账号密码不得为空的检查
        assertEquals("用户名不得为空", userService.addUser(new UserPo()));
        
        //密码为空的测试
        assertEquals("用户密码不得为空", userService.addUser(new UserPo() {{
            setUsername("username");
        }}));
        
        //账号为空的测试
        assertEquals("用户名不得为空", userService.addUser(new UserPo() {{
            setUserPassword("password");
        }}));
        
        //账号密码都有，插入成功
        assertEquals(null, userService.addUser(new UserPo() {{
            setUsername("username");
            setUserPassword("password");
        }}));
    }

    @Test
    public void getUser() {
        //这里每调用userDao的selectOne方法时，都返回一个username为"create by mock"的对象
        when(userDao.selectOne(any(UserQuery.class)))
                .thenReturn(new UserBo() {{
                    setUsername("create by mock");
                }});

        assertEquals("create by mock", userService.getUser(new UserQuery()).getUsername());
    }
}
```

首先第一步，我们不要spring注入的UserService，所以需要我们自己new了。并且用`@InjectMocks`注解来告诉Mockito这个是被测试的对象。

然后UserServiceImpl里的UserDao依赖怎么办呢？这就是第二步，使用`@Mock`注解标识UserDao，告诉Mockito需要把UserDao作为依赖注入到被`@InjectMocks`注解的UserServiceImpl里。

第三步，用`@Before`注解的方法里，在junit调用测试方法之前初始化测试用例类中由Mockito的注解标注的所有模拟对象。

第四步，那Mockito给的UserServiceImpl注入的UserDao是咋实现的呢，如果是接口就通过代理，如果是类就通过继承，其具体的返回我们可以通过mockito提供的静态方法`when`来定义。例如addUser方法的when的含义就是：当UserDao的insert方法被传入任意为UserPo对象时，返回1。并且when方法既可以在`@Test`方法里写，也可以在`@Before`方法里写，区别就是`@Before`方法里写的对任意`@Test`方法的测试都有效，而在`@Test`方法里写的只在本`@Test`方法里有效。

最后，连spring都没有加载，就能完成测试啦~

参考文献

[Spring Boot中采用Mockito来mock所测试的类的依赖（避免加载spring bean，避免启动服务器）](https://www.cnblogs.com/csonezp/p/7868127.html "Spring Boot中采用Mockito来mock所测试的类的依赖（避免加载spring bean，避免启动服务器）")
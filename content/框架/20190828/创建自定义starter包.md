---
createdAt: '2019-08-28'
updatedAt: '2019-08-28'
---

<!--more-->

# 一个先行问题

在创建自定义starter包中，让我思考了一个我认为是先行的问题：满足什么特性，实际上才是一个starter包？当然这个问题我思考的不算透彻，但也有了一个简单的答案。我们可以建立一个任意的spring项目，用上所需要的注解，改个starter名字，打成一个包作为依赖引入springboot项目里，依照spring的特性，我们让springboot扫描依赖包的包名，自然就能自动注入依赖里的bean。但我认为这不是一个starter包。starter包是springboot的包，需要体现springboot的自动配置特性。举个例子，springboot的jdcb的starter包，能根据导入的数据库驱动类型来自动配置，这绝不是一个普通的spring应用包会做的。然后还有次要的，当然也是很重要的一点，就是导入的starter包从来都不需要使用者显式配置扫包，这点的实现是利用了springboot的一些特性。因此，会被springboot触发，根据环境来进行自动配置，完成bean的装配与控制反转的包，才是一个starter包。

# 创建一个基础springboot

先创建一个普通的springboot项目，作为starter，Spring官方的Starter通常命名为`spring-boot-starter-{name}`，所以Spring官方建议非官方Starter项目名称建议遵循`{name}-spring-boot-starter`格式。这里我创建一个`hello-spring-boot-starter`项目，功能很简单，就是sayhello。项目包名为`com.example`。

1. Config会读取配置文件里的name（自己的名字）
2. PeopleDao根据id从数据库读取name（他人的名字）
3. HelloService的sayHello方法，会根据自己的名字和他人的名字拼凑sayHello语句
4. PeopleService的talk方法，会根据id查到他人的名字，通过sayHello方法得到sayHello语句

最后在单元测试里测试一下，没问题，一个简单的，没有controller的springboot项目完成

```java
@Data
@Configuration
@ConfigurationProperties(prefix = "hello")
public class Config {
    private String name;
}


@Repository
public class PeopleDaoImpl implements PeopleDao {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public PeopleDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public String selectNameById(int id) {
        return jdbcTemplate.queryForObject("select name from people where id=?", String.class, id);
    }
}


@Service
public class HelloServiceImpl implements HelloService {

    private Config config;

    @Autowired
    public HelloServiceImpl(Config config) {
        this.config = config;
    }

    @Override
    public String sayHello(String name) {
        return "hello " + name + ", my name is " + config.getName();
    }
}


@Service
public class PeopleServiceImpl implements PeopleService {

    private HelloService helloService;
    private PeopleDao peopleDao;

    @Autowired
    public PeopleServiceImpl(HelloService helloService, PeopleDao peopleDao) {
        this.helloService = helloService;
        this.peopleDao = peopleDao;
    }

    @Override
    public String talk(int id) {
        String name = peopleDao.selectNameById(id);
        return helloService.sayHello(name);
    }
}


@RunWith(SpringRunner.class)
@SpringBootTest
public class HelloSpringBootStarterApplicationTests {
    @Autowired
    private PeopleService peopleService;

    @Test
    public void contextLoads() {
        System.out.println(peopleService.talk(1));
    }
}
```

```yml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8
    username: root
    password: 123456

hello:
  name: "aaa"
```

# 自动装配

自动装配只是对于使用者，代价就是实现者需要显式声明整个装配过程，并通过各种条件化注解进行控制。所以添加一个bean的装配类。

```java
@Configuration
@EnableConfigurationProperties(Config.class)
public class HelloAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(PeopleService.class)
    public PeopleService createPeopleService(HelloService helloService, PeopleDao peopleDao) {
        PeopleService service = new PeopleServiceImpl(helloService, peopleDao);
        System.out.println("创建-PeopleService");
        return service;
    }

    @Bean
    @ConditionalOnMissingBean(HelloService.class)
    public HelloService createHelloService(Config config) {
        HelloService service = new HelloServiceImpl(config);
        System.out.println("创建-HelloService");
        return service;
    }

    @Bean
    @ConditionalOnMissingBean(PeopleDao.class)
    public PeopleDao createPeopleDao(JdbcTemplate jdbcTemplate) {
        PeopleDao service = new PeopleDaoImpl(jdbcTemplate);
        System.out.println("创建-PeopleDao");
        return service;
    }
}
```

这里解释一下各个注解：
1. `@Configuration`表明这个是一个装配bean的类，并将改类作为bean注册，因为`@Configuration`本身包含了`@Component`
2. `@EnableConfigurationProperties`开启属性配置，并指定从配置文件里读取配置的类Config，springboot扫描到这个注解，会将配置文件装配到Config类里，然后注册为bean。这也是为什么createHelloService方法能注入Config的原因。至于怎样不给spring指定包名有扫到这个注解和类，下面会讲到。
3. `@ConditionalOnMissingBean(clazz)`只有当clazz没有被注册为bean时，才进行装配。这个注解可以试试注释掉，然后跑起项目就会报错。因为例如在PeopleServiceImpl类已经有@Service，已经注册了，这里再注册就会报错。自动装配少不了各种条件化注解，但这个demo比较简单，就没去做两种接口实现，根据条件进行二选一进行自动装配的效果了。

# spring.factories文件
创建`resources/META-INF/spring.factories`文件，将上面的配置类`HelloAutoConfiguration`配置进去。这是springboot的特性，springboot会去读取spring.factories文件，然后加载装配这里面配置的配置类。

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.example.hellospringbootstarter.config.HelloAutoConfiguration
```

# 打包
springboot生产的jar包是可执行jar，导入是引入不了依赖的，为了生产普通的jar包，需要包springboot的maven打包插件注释掉再打包，安装到本地。
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.7.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>hello-spring-boot-starter</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>hello-spring-boot-starter</name>
    ...

<!--    <build>-->
<!--        <plugins>-->
<!--            <plugin>-->
<!--                <groupId>org.springframework.boot</groupId>-->
<!--                <artifactId>spring-boot-maven-plugin</artifactId>-->
<!--            </plugin>-->
<!--        </plugins>-->
<!--    </build>-->

</project>
```

# 引入自定义的starter包

来新建一个新的普通项目，为了避免扫描影响，新项目包名为`net.example`。导入依赖，建个controller用一下。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.7.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>net.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>


        <dependency>
            <groupId>com.example</groupId>
            <artifactId>hello-spring-boot-starter</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

```java
@RestController
@RequestMapping("")
public class Controller {
    @Autowired
    private PeopleService peopleService;

    @GetMapping("/")
    public String sayHello(int id) {
        return peopleService.talk(id);
    }
}
```

新项目配置，hello.name避开starter的默认配置

```
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8
    username: root
    password: 123456

hello:
  name: "zzz"
```

完成
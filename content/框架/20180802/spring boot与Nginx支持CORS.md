---
createdAt: '2018-08-02'
updatedAt: '2018-08-02'
---
让spring boot支持CORS非常简单，不用做任何配置，只需要在controller里使用`@CrossOrigin`注解即可。

@CrossOrigin注解可以使用在类或者方法上，其参数主要有origins和maxAge，用来指定允许跨域的域默认是\*，和OPTIONS响应的有效时间，默认是1800。当类和方法都使用@CrossOrigin注解时，会自动合并两个注解的参数。

<!--more-->

例如官方文档的一个例子：

```java
@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/account")
public class AccountController {

    @CrossOrigin(origins = "http://domain2.com")
    @GetMapping("/{id}")
    public Account retrieve(@PathVariable Long id) {
        // ...
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable Long id) {
        // ...
    }
}
```

如果有使用Spring Security的话，在Spring Security的配置类里给配置加上一下代码即可：
```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .cors().and()
    ...
}
```

Nginx的方案先挖个坑，网上有很多例子，但是没空亲试，以后再补

参考文献：

[CORS support in Spring Framework](https://spring.io/blog/2015/06/08/cors-support-in-spring-framework "CORS support in Spring Framework")

[https://docs.spring.io/spring-security/site/docs/current/reference/html/cors.html](https://docs.spring.io/spring-security/site/docs/current/reference/html/cors.html)
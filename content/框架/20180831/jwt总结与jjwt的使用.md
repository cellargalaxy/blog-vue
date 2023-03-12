---
createdAt: '2018-08-31'
updatedAt: '2018-08-31'
---

<!--more-->

jwt是一种无状态的token授权技术，通过签名算法防止token被篡改。因此jwt其实就是字符串，可以看到小圆点将整个jwt分为三部分，这三部分的名字分别叫做头部(header)、载荷(payload)与签名。
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJjZWxsYXJnYWxheHkiLCJleHAiOjE1MTYyMzkwMjJ9.zvVtSIOklnCWPKRTskzTb4vJY4OnhmgS0ngXzfkJRpg
```

# 头部
头部经过base64编码，反编码之后其实是个json。typ表示这个token要以jwt方式解析（可能使用不同的协议的token也会是这个样子吧）。alg表示签名所用的签名算法。
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

# 载荷
载荷是开发的我们用来存储数据的地方，同样只是被base64编码过，反编码后也是个json。其中sub表示账号，name表示账户名，exp表示这个jwt的过期时间。
```json
{
  "sub": "12345",
  "name": "cellargalaxy",
  "exp": 1516239022
}
```
jwt规定的载荷的五个标准属性：
+ ss: 该jwt的签发者
+ sub: 使用该jwt的用户
+ aud: 验证该jwt的服务者
+ exp(expires): 什么时候过期，这里是一个Unix时间戳
+ iat(issued at): 在什么时候签发的

所以其实上面的name是自己添加的字段，因此在载荷里我们可以添加任何数据。但是由于只是base64编码，因此不应该在这里存储密码之类的敏感数据。载荷的作用就是用来标识这个用户所提交的账号，至于这个用户是不是真的是这个账号，是由第三部分的签名来验证的。

# 签名
签名就不是base64编码了，是使用头部的签名算法加密出来的字符串。而签名的加密方法是：

1. 将前面的头和荷载的json分别base64加密，然后用小圆点连接在一起。其实就是jwt不要签名部分和第二个小圆点
2. 使用一个指定的密匙，通过头里的签名算法加密第一步的字符串，得到签名。即：`HS256(base64(header)+"."+base64(payload),secret)`

# jjwt的使用
第一自行maven

第二生成jwt
```java
public static void main(String[] args) {
    String jwt = Jwts.builder()
        //签名算法与密匙
        .signWith(SignatureAlgorithm.HS256,"SECRET_KEY")
        //账号
        .setSubject("cellargalaxy")
        //过期时间（立即过期）
        .setExpiration(new Date())
        //加入自定义key，value
        .claim("key","vaule")
        .compact();
}
```
第三解析jwt
```java
public static void main(String[] args) {
    try {
        //解析JWT字符串中的数据，并进行最基础的验证
        Claims claims = Jwts.parser()
            //会自动签名算法
            .setSigningKey("SECRET_KEY")
            //jwt字符串
            .parseClaimsJws(jwt)
            .getBody();
        //获取自定义字段key
        String vaule = claims.get("key", String.class);
    } catch (SignatureException e) {
        //如果密钥不正确，抛出SignatureException异常
        e.printStackTrace();
    } catch (ExpiredJwtException e) {
        //如果jwt已过期，抛出ExpiredJwtException异常
        e.printStackTrace();
    }
}
```

参考文献：

[JSON Web Token - 在Web应用间安全地传递信息](http://blog.leapoahead.com/2015/09/06/understanding-jwt/ "JSON Web Token - 在Web应用间安全地传递信息")

[ 使用JWT确保API的安全](https://segmentfault.com/a/1190000007119872 " 使用JWT确保API的安全")
---
createdAt: '2019-11-11'
updatedAt: '2019-11-11'
---
# 前言

貌似我许久以前去尝试去看过OAuth2.0的东西，但看了一下这么鬼复杂，又这个请求那个请求，这个token那个token，哪用得着这么复杂~~（看不懂才对）~~，然后就放弃了。

<!--more-->

# OAuth 2.0是啥

OAuth2.0是一个行业的标准授权协议。他能够为Web，桌面，手机等设备应用的第三方服务，颁发一个有时效性的令牌token，使得第三方应用能够进行一些授权操作。例如需要注册某个论坛，可以用qq等账号进行第三方账号登录。这里就是利用OAuth2.0协议进行读取用户信息授权，免去手动填写注册信息的操作。

# OAuth2.0中的角色

1. `resource server`，资源服务器，在上面的例子中，就是qq的用户信息服务器
2. `authorization server`，授权服务器，在上面的例子中，就是qq的授权服务器
3. `resource owner`，资源所有者，在上面的例子中，就是需要注册论坛的用户。资源所有者中所谓的资源指的是储存在qq的用户信息服务器里的用户信息，并不是论坛的资源
4. `user-agent`，用户代理，在上面的例子中，就是用于用于注册论坛账号的浏览器
5. `client`，客户端，在上面的例子中，就是论坛后台

# 客户端向服务商注册

服务端指的就是论坛。客户端一般需要向服务端注册，一般需要提供客户端的应用名称、应用网站、重定向URI或回调URL（redirect_uri），来向服务端表明一个什么样的客户端想获得服务端的授权和服务。同时服务端会给客户端一个客户端ID`client_id`和客户端密钥`client_secret`。在将来客户端请求服务端的时候表明身份和授权。客户端标识可以公开，客户端密钥则需要保密。

# OAuth2.0授权类型

OAuth2.0举例了四种授权模式，适用于不同的场景：

+ 授权码模式（authorization code）
+ 隐藏模式（implicit）
+ 密码模式（resource owner password credentials）
+ 客户端模式（client credentials）

# 授权码模式（authorization code）

授权码模式是功能最完整、流程最严密的授权模式。大致流程是：

1. 资源所有者通过用户代理访问客户端，客户端重定向授权服务器的授权页面给用户代理
2. 资源所有者通过授权页面通知授权服务器给某客户端授权
3. 授权服务器返回一个授权码给用户代理，并根据客户端设定好的重定向地址，用户代理将授权码重定向给客户端
4. 客户端获取到授权码，去授权服务器获取token
5. 授权服务器检查授权码，并返回token
6. 客户端获取到token，根据token去资源服务器获取资源

```
    +----------+
    | Resource |
    |   Owner  |
    |          |
    +----------+
         ^
         |
        (B)
    +----|-----+          Client Identifier      +---------------+
    |         -+----(A)-- & Redirection URI ---->|               |
    |  User-   |                                 | Authorization |
    |  Agent  -+----(B)-- User authenticates --->|     Server    |
    |          |                                 |               |
    |         -+----(C)-- Authorization Code ---<|               |
    +-|----|---+                                 +---------------+
      |    |                                         ^      v
     (A)  (C)                                        |      |
      |    |                                         |      |
      ^    v                                         |      |
    +---------+                                      |      |
    |         |>---(D)-- Authorization Code ---------'      |
    |  Client |          & Redirection URI                  |
    |         |                                             |
    |         |<---(E)----- Access Token -------------------'
    +---------+       (w/ Optional Refresh Token)

    Note: The lines illustrating steps (A), (B), and (C) are broken into
    two parts as they pass through the user-agent.

                    Figure 3: Authorization Code Flow
```

1、客户端重定向授权服务器的授权页面给用户代理，授权服务器返回一个授权码

```
https://qq.com/login/oauth/authorize?
  response_type=code&
  client_id=a5ce5a6c7e8c39567ca0&
  redirect_uri=https://bbs.net/api/oauth/callback&
  scope=user:email
```
|字段|描述|
|-|-|
|response_type|必须，固定为 code，表示这是授权码模式|
|client_id|必须，客户端向服务端注册获得的客户端ID|
|redirect_uri|可选，通过客户端注册的重定向URI，一般与注册时一致|
|scope|可选，请求资源范围，多个空格隔开|
|state|可选，如果存在，原样返回给客户端|

返回值：

```
https://bbs.net/api/oauth/callback?code=fb6a88dc09e843b33f
```
|字段|描述|
|-|-|
|code|必须。授权码|
|state|如果出现在请求中，必须包含|

2、客户端获取到授权码，去授权服务器获取token

```
https://qq.com/login/oauth/access_token?
  client_id=a5ce5a6c7e8c39567ca0&
  client_secret=xxxx&
  grant_type=authorization_code&
  code=fb6a88dc09e843b33f&
  redirect_uri=https://bbs.net/api/oauth/callback
```
|字段|描述|
|-|-|
|client_id|必须，客户端标识|
|client_secret|必须，客户端密钥|
|grant_type|必须，固定为 authorization_code／refresh_token|
|code|必须，上一步获取到的授权码|
|redirect_uri|必须，完成授权后的回调地址，一般与注册时一致|

返回值：

```json
{
  "access_token":"a14afef0f66fcffce3e0fcd2e34f6ff4",
  "token_type":"bearer",
  "expires_in":3920,
  "refresh_token":"5d633d136b6d56a41829b73a424803ec"
}
```
|字段|描述|
|-|-|
|access_token|这个就是最终获取到的令牌|
|token_type|令牌类型，常见有 bearer/mac/token（可自定义）|
|expires_in|失效时间|
|refresh_token|刷新令牌，用来刷新 access_token|

# 隐藏模式（implicit）

隐藏模式一般用于移动客户端或网页客户端。隐藏式相较于授权码模式，会省略通过授权码获取token的步骤，并且在用户代理直接获取token。会存在token泄露给给用户和用户设备上的其它客户端的风险，因此只用于安全要求不高，并且令牌的有效期非常短，例如会话期间。大致流程是：

1. 资源所有者通过用户代理访问客户端，客户端重定向授权服务器的授权页面给用户代理
2. 资源所有者通过授权页面通知授权服务器给某客户端授权
3. 授权服务器返回token给用户代理

```
    +----------+
    | Resource |
    |  Owner   |
    |          |
    +----------+
         ^
         |
        (B)
    +----|-----+          Client Identifier     +---------------+
    |         -+----(A)-- & Redirection URI --->|               |
    |  User-   |                                | Authorization |
    |  Agent  -|----(B)-- User authenticates -->|     Server    |
    |          |                                |               |
    |          |<---(C)--- Redirection URI ----<|               |
    |          |          with Access Token     +---------------+
    |          |            in Fragment
    |          |                                +---------------+
    |          |----(D)--- Redirection URI ---->|   Web-Hosted  |
    |          |          without Fragment      |     Client    |
    |          |                                |    Resource   |
    |     (F)  |<---(E)------- Script ---------<|               |
    |          |                                +---------------+
    +-|--------+
      |    |
     (A)  (G) Access Token
      |    |
      ^    v
    +---------+
    |         |
    |  Client |
    |         |
    +---------+

    Note: The lines illustrating steps (A) and (B) are broken into two
    parts as they pass through the user-agent.

                    Figure 4: Implicit Grant Flow
```

1、客户端重定向授权服务器的授权页面给用户代理，授权服务器返回token

```
https://qq.com/login/oauth/access_token?
  response_type=token&
  client_id=a5ce5a6c7e8c39567ca0&
  redirect_uri=https://bbs.net/api/oauth/callback&
  scope=user:email
```
|字段|描述|
|-|-|
|response_type|必须，固定为token，代表这是隐藏模式|
|token_type|令牌类型，常见有 bearer/mac/token（可自定义）|
|expires_in|失效时间|
|refresh_token|刷新令牌，用来刷新 access_token|

返回值：

可以看到返回值的access_token放在锚点里，由于锚点不会发到服务器，减少了因"中间人攻击"泄漏令牌的风险。

```
https://bbs.net/api/oauth/callback#
  access_token=a14afef0f66fcffce3e0fcd2e34f6ff4&
  token_type=token&
  expires_in=3600
```
|字段|描述|
|-|-|
|access_token|必须。授权服务器分配的访问令牌|
|token_type|必须。令牌类型|
|expires_in|推荐，访问令牌过期的秒数|
|scope|可选，访问令牌的作用域|
|state|必须，如果出现在授权请求期间，和请求中的 state 参数一样|

# 密码模式（resource owner password credentials）

密码模式是资源所有者直接将他在服务端的账号密码给客户端，客户端通过账号密码登录服务端进行操作。在这种模式中，客户端不得储存密码。并且通常用在用户对客户端高度信任的情况下，比如客户端是操作系统的一部分，或者由一个著名公司出品才会使用。以及在授权服务器无法使用其他授权模式的情况下，才能考虑使用这种模式。

1. 资源所有者通过用户代理给客户端账号密码
2. 客户端通过账号密码向授权服务器获取token

```
    +----------+
    | Resource |
    |  Owner   |
    |          |
    +----------+
         v
         |    Resource Owner
        (A) Password Credentials
         |
         v
    +---------+                                  +---------------+
    |         |>--(B)---- Resource Owner ------->|               |
    |         |         Password Credentials     | Authorization |
    | Client  |                                  |     Server    |
    |         |<--(C)---- Access Token ---------<|               |
    |         |    (w/ Optional Refresh Token)   |               |
    +---------+                                  +---------------+

            Figure 5: Resource Owner Password Credentials Flow
```

1、客户端通过账号密码向授权服务器获取token

```
https://qq.com/login/oauth/access_token?grant_type=password&username=USERNAME&password=PASSWORD&client_id=CLIENT_ID
```
|字段|描述|
|-|-|
|grant_type|必须，固定为 password|
|username|必须，UTF-8 编码的资源拥有者用户名|
|password|必须，UTF-8 编码的资源拥有者密码|
|scope|可选，访问令牌的作用域|

返回值：

```
{ 
  "access_token"  : "...",
  "token_type"    : "...",
  "expires_in"    : "...",
  "refresh_token" : "...",
}
```

# 客户端模式（client credentials）

客户端模式中，对服务端而言，客户端充当了资源所有者的角色，因为服务端已经看不到资源所有者。客户端只需要`client_id`和`client_secret`就可以操作资源了。所以其实不存在资源所有者授权给客户端的问题，或者资源所有者在一切之初已经将全部权限无限期移交给客户端。

1. 客户端通过`client_id`和`client_secret`，向授权服务器申请token

```
    +---------+                                  +---------------+
    |         |                                  |               |
    |         |>--(A)- Client Authentication --->| Authorization |
    | Client  |                                  |     Server    |
    |         |<--(B)---- Access Token ---------<|               |
    |         |                                  |               |
    +---------+                                  +---------------+

                    Figure 6: Client Credentials Flow
```

```
https://qq.com/login/oauth/access_token?grant_type=client_credentials&client_id=CLIENT_ID&client_secret=CLIENT_SECRET
```
|字段|描述|
|-|-|
|grant_type|必须。必须设置到客户端证书中|
|scope|可选，访问令牌的作用域|

返回值：

```
{ 
  "access_token"  : "...",
  "token_type"    : "...",
  "expires_in"    : "...",
  "refresh_token" : "...",
}
```

参考文章：

[10 分钟理解什么是 OAuth 2.0 协议](https://deepzz.com/post/what-is-oauth2-protocol.html)

[理解OAuth 2.0](https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)

[OAuth 2.0 的四种方式](https://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)
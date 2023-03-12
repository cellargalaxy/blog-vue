---
createdAt: '2021-04-19'
updatedAt: '2021-04-19'
---
Protocol Buffers(简称Protobuf) 是Google的一个序列化框架，与开发语言、平台无关。

支持Java、Python、C++、Go、JavaNano、Ruby、C#。

Portobuf的序列化体积比XML和JSON小，并且序列化和反序列化的速度更快。

使用Portobuf需要先安装Portobuf的命令行工具protoc，编写protobuf文件，使用protoc生成对应语言的代码。

<!--more-->

# 安装protobuf
安装protobuf库文件
```shell
go get github.com/golang/protobuf/proto
```

安装go生成插件
+ protoc-gen-go
+ protoc-gen-gogo：和protoc-gen-go生成的文件差不多，性能也几乎一样(稍微快一点点)
+ protoc-gen-gofast：生成的文件更复杂，性能也更高(快5-7倍)

```shell
#go
go get github.com/golang/protobuf/protoc-gen-go
#gogo
go get github.com/gogo/protobuf/protoc-gen-gogo
#gofast
go get github.com/gogo/protobuf/protoc-gen-gofast

#安装库文件
go get github.com/gogo/protobuf/proto
go get github.com/gogo/protobuf/gogoproto
```

看看是否安装正常
```shell
protoc --version
```

三种插件生成代码的参数
```shell
#go
protoc --go_out=. *.proto
#gogo
protoc --gogo_out=. *.proto
#gofast
protoc --gofast_out=. *.proto
```

# protobuf文件
示例
```protobuf
syntax="proto3"; //使用版本生成代码
option go_package = ".;proto"; //生成的go代码里的包名

package proto; //没搞懂作用

//枚举类型，必须从0开始
enum UserType {
    ADMIN = 0;
    VISITOR = 1;
}

message Address {
    string city = 1;
    string street = 2;
}

message User {
    int32 id = 1;
    UserType user_type = 2;
    string name = 3;
    Address address = 4; //内嵌结构体
    repeated string label = 5; //数组
    map<string,int32> cookie_expire = 6; //map
}
```

# 序列化使用
如果使用gofast的话，有几个能直接调用的序列化方法
```go
var user proto.User
data, err := user.Marshal() //序列化为二进制数据
```

# 参数文章

[golang使用protobuf](https://yushuangqi.com/blog/2017/golangshi-yong-protobuf.html)

[基于protobuf快速生成服务治理的RPC代码](https://colobu.com/2020/05/10/generate-rpcx-code-from-protobuf-files/)

[Golang gRPC实践 连载三 Protobuf语法](https://segmentfault.com/a/1190000007917576)
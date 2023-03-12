---
createdAt: '2022-01-16'
updatedAt: '2022-01-16'
---
夜深，好困，长话短说。

+ loki：存储查询日志的服务，对外提供一个http端口
+ promtail：收集日志，把日志发生到loki里进行管理
+ grafana：可以通过loki的接口查询日志

<!--more-->

# 预备工作

loki的http端口需要对外，但loki的http貌似没权限校验功能，所以用caddy反代置于，加个账号密码校验。

caddy的配置，使用basicauth加上账号密码校验。admin就是账号，后面的是密码的hash base64。 这个hash base64需要使用caddy来生成，执行`caddy hash-password`
，输入两次密码，就能生成。

```shell
:80 {
  encode gzip zstd
  
  route /loki/* {
    uri strip_prefix /loki
    reverse_proxy 127.0.0.1:3100
  }
    
  basicauth /loki/* {
    admin JDJhJDE0JEZDN1Q0ZjZwc2ZrbG1FODROdndmc09UZzRJWW41c2QyaFB0aUFnSUhwL3JZWVRob1FabWV1
  }
}
```

# grafana

grafana没啥要求的，docker直接安装就好

```shell
sudo docker volume create grafana_data
sudo docker run -d \
  --restart=always \
  --name grafana \
  -e GF_SERVER_ROOT_URL=https://example.com/grafana/ \
  -e GF_SERVER_SERVE_FROM_SUB_PATH=true \
  -p 3000:3000 \
  -v grafana_data:/var/lib/grafana \
  grafana/grafana
```

# loki

配置文件，加了注释的可以按需改改，其余的都是官方默认配置。

官方配置：https://grafana.com/docs/loki/latest/configuration/

```yaml
auth_enabled: false

server:
  http_listen_port: 3100
  grpc_listen_port: 9096

common:
  path_prefix: /tmp/loki
  storage:
    filesystem:
      chunks_directory: /tmp/loki/chunks
      rules_directory: /tmp/loki/rules
  replication_factor: 1
  ring:
    instance_addr: 127.0.0.1
    kvstore:
      store: inmemory

schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

ruler:
  alertmanager_url: http://localhost:9093

limits_config:
  reject_old_samples: true #是否拒绝旧样本
  reject_old_samples_max_age: 720h #30d,默认168h(7d),之前的样本被拒绝
  ingestion_rate_mb: 32 #每用户每秒样本大小的摄取速率限制。单位为 MB
  max_entries_limit_per_query: 10000 #默认5000,最大查询行数

table_manager:
  retention_deletes_enabled: true #开启删除
  retention_period: 720h #30d,默认744h(31d),超过的数据将被删除
```

安装

```shell
sudo docker run -d \
  --restart=always \
  --name loki \
  -p 3100:3100 \
  -v /config:/config \
  grafana/loki \
  -config.file=/config/loki.yaml
```

安装完之后可以进`http://127.0.0.1:3100/loki/ready`。一开始会线上要等等，还没ready。等个一会就会显示ready了。

# promtail

配置文件，官方配置：https://grafana.com/docs/loki/latest/clients/promtail/configuration/

`/log/*log`，promtail会抓取/log下面全面log结尾的文件

启动之后可以看看日志，如果发现请求loki被拒绝，报429，可能是promtail给loki一口气发送的日志过大。可以修改loki的速率限制配置。

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

client:
  url: http://127.0.0.1:3100/loki/api/v1/push
  basic_auth:
    username: username
    password: password

scrape_configs:
  - job_name: log
    static_configs:
      - targets:
          - localhost
        labels:
          job: log
          __path__: /log/**/*.log
    pipeline_stages:
      - regex: #https://regex101.com/
          expression: '(?P<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}).+\[(?P<level>[A-Z]{4})\].+\[logid:(?P<logid>[0-9]+)\].+\[sn:(?P<sn>.+)\].+\[ip:(?P<ip>[0-9.]+)\].+\[caller:"(?P<caller>.+)"\]'
      - labels:
          level:
          logid:
          sn:
          ip:
          caller:
      - timestamp:
          source: timestamp
          format: RFC3339
```

安装

加有日志文件的文件夹挂载到容器内的/log里。

```shell
sudo docker run -d \
  --restart=always \
  --name promtail \
  -v log:/log \
  -v /config.yml:/config.yml \
  grafana/promtail \
  -config.file=/config.yml
```

# 查询

在grafana的左边菜单里找到`Configuration`，在配置里添加数据源。
按理数据源的列表有loki可以选。URL填上`http://127.0.0.1:3100/loki`。有账号密码就在`Basic auth`里填一下。保存测试。

左侧菜单里去到`Explore`，点一下`Log browser`，正常的话就有日志文件和任务名称可以选。
所谓的任务名称，是promtail配置里的`scrape_configs.static_configs.labels.job`那一项。

查询logid：`{job="log"} |= "211016031700537788"`

参考文章

+ [官方安装教程](https://grafana.com/docs/loki/latest/installation/docker/)
+ [轻量级的日志系统Loki体验](https://joelei.com/2021/06/lightweight-log-system-loki-experience/)
+ [Loki 轻量级日志收集系统](https://xiaosongs.com/operation/loki/)
+ [生产环境中Loki的优化](https://www.feiyiblog.com/2021/09/16/生产环境中Loki的优化/)
+ [Loki、promtail、Grafana、Prometheus日志监控安装与配置](https://www.yoyoask.com/?p=4436)

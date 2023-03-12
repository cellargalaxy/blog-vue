## 分工

+ node-exporter：安装在每台主机上，用于收集主机数据
+ prometheus：会去每台主机的node-exporter拉取收集数据
+ grafana：查询prometheus的数据用于展示

## 安装exporter

运行起来大约只会消耗10M左右的内存

+ https://github.com/prometheus/node_exporter
+ https://hub.docker.com/r/prom/node-exporter

```shell
#port=9100
sudo docker run -d \
--restart=always \
--name node-exporter \
--net="host" \
--pid="host" \
-v "/:/host:ro,rslave" \
prom/node-exporter \
--path.rootfs=/host

sudo docker run -d \
--restart=always \
--name mysqld-exporter \
-p 9104:9104 \
-e DATA_SOURCE_NAME="user:pw@(ip:port)/" \
prom/mysqld-exporter

sudo docker run -d \
--restart=always \
--name redis-exporter \
-p 9121:9121 \
-v "/:/host:ro,rslave" \
bitnami/redis-exporter \
--redis.addr redis://ip:port \
--redis.password 'pw'
```

浏览器打开`http://ip:9100/metrics` ，如果有东西就算安装完了

## 安装prometheus

+ https://prometheus.io/docs/prometheus/latest/installation/
+ https://hub.docker.com/r/prom/prometheus

配置文件，看网上说数据默认过期是30日，但是没找到通过配置文件修改过期时间的方法

```shell
global:
  scrape_interval: 1m #默认情况下抓取目标的频率
  scrape_timeout: 10s #刮取请求超时的时间
  evaluation_interval: 1m #评估规则的频率

scrape_configs: #抓取配置列表
  - job_name: linux
    metrics_path: '/metrics'
    basic_auth:
      username: 'admin'
      password: 'admin'
    static_configs:
      - targets: [ 'ip:port' ]
        labels:
          instance: 实例名称
```

```shell
sudo docker run -d \
--restart=always \
--name prometheus \
-p 9090:9090 \
-v /prometheus.yml:/etc/prometheus/prometheus.yml \
prom/prometheus
```

+ `http://ip:9090/metrics` ：有页面显示
+ `http://ip:9090/graph` ：有页面显示
+ `http://ip:9090/targets` ：有机器列表，有`UP`就是正常

## grafana安装

略过

## grafana配置

在左边菜单的齿轮进入plugins，安装prometheus插件。
填URL、Basic auth，HTTP Method选GET。最后save and test。

下载grafana模板的json。
推荐用https://grafana.com/grafana/dashboards/8919的2020年版本，2022版本好像有bug，磁盘数据没显示。

在左边dashboards菜单里，选import，导入刚下载的json文件。
VictoriaMetrics选刚创建的prometheus数据源。

参考文章

+ https://blog.csdn.net/qq_37688023/article/details/106532101
+ https://www.fyovo.com/6180.html

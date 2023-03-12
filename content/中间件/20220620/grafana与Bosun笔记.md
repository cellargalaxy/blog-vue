# 左侧菜单

## 创建dashboard

左边菜单的加号➕里创建一个dashboard，添加一个空的panel

# dashboard配置

## 下拉选择

1. 点击右上角齿轮⚙
2. 左边菜单的variables，添加一个参数
3. Name，Label：随意
4. Type：query
5. Refresh：随意，一般on time range change
6. Query：tag_values(metrics指标名,tag名称)
7. Include All option：开启全选，全选的值是*
8. 然后在Preview of values里就会罗列目前有哪些值

# Query tab

## 使用Metric画图

1. Metric
   1. Metric指标名
   2. Aggregator：不晓得
   3. Alias：图里展示这条线的别名
2. Down sample
   1. Down sample：将多久时间里的原始数据进行统计
   2. Aggregator：统计聚合的方式
   3. Fill：没数据的点怎么填充
3. Filters：可以设置多个tag的过滤，包括使用下拉选择来过滤。
   1. key即tag名称
   2. Type见下Bosun比较类型
   3. filter：可以写死某个值，如果有个参数叫env，filter可以填$env，则能下拉选择
   4. Group by：是否对这个参数分组显示
4. Tags：推荐使用Filters
5. Rate
   1. Rate：对数据求导，常用于算QPS，默认单位秒
      1. Counter：不晓得
   2. Explicit tags：不晓得
   3. Delta当前点减前一个点
      1. Counter：不晓得，但是能计算每个Down sample的数量，例如计算QPM

## 使用Bosun画图(计算XX率)

Query tab下面选择数据源bosun

例如计算成功率，($success+1)/($all+1)可以令$all=$success=0时，成功率=100%

```
$all=q("sum:1m-sum-zero:rate{counter,,,diff}:metrics指标名{}{env=$env}", "$start", "")
$success=q("sum:1m-sum-zero:rate{counter,,,diff}:metrics指标名{}{env=$env}", "$start", "")

($success+1)/($all+1)
```

# Transform tab

## 图标别名

1. Outer join：不晓得，但得先选，不用选择Field name的下拉框
2. Organize fields：可以对图标名称起别名

# 图标

右边Panel里有个Legend，把Show打开即有图标，下面的选项可以选择展示图标的哪些参数

# Bosun查询语句格式

```
<aggregator>:<downsample>:<rate_option>:<topk>:<metric_name>{<group>}{<filter>}
q("sum:30s-sum-zero:rate:xxx.fail{env=*}", "1h", "")
```

1. aggregator：metrics聚合方式
2. downsample：metrics降采样
   1. 30s：聚合的时间区间
   2. sum：聚合方法
   3. zero：空值填充方法
3. rate_option：降采样里的数据的聚合方式，可选
   1. 应用metircs里面的rate counter, 可以直接写做rate{counter}
   2. 应用metrics里面的diff，那么写做rate{,,,diff,}
   3. 应用metrics里面的after_downsample，那么写做rate{,,,,after_downsample}
4. Topk：可选
   1. 例如top-10-max，按照max排序，取前10个
5. metric_name：metric指标名称
6. group：使用tag对数据进行聚合/过滤
   - literal_or：x=literal_or(A|B)：x=(A or B)
   - iliteral_or：大小写不敏感的literal_or
   - not_literal_or：x=not_literal_or(A|B)：x!=(A or B)
   - not_iliteral_or：大小写不敏感的not_literal_or
   - wildcard：通配符，用*占位，一般可以拿来匹配前后缀
   - iwildcard ：大小写不敏感的wildcard
   - regexp：正则

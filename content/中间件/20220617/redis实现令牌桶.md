记录一下最近用到了令牌桶来限频。在网上所说的令牌桶的基础上，还有一个很有用的做法。
是允许一定程度的透支未来的令牌，但取得透支令牌的请求需要sleep一段时间。如果sleep的时间超过了能接受的上限，还是会被频率。
这样子在sleep的时间范围内，其实起到了削峰填谷的作用。对于一些会一波一波来的请求，能起到平滑的作用。

下面就直接贴lua脚本

```
//      限频的key
keys = ["qps_limit_xxx"]
//      所取走的令牌数  当前时间，毫秒  最大等待时间，毫秒  令牌桶容量  周期，毫秒
args = [1,            now.ts(),    "3s".ts(),        100,      1000] //也就是QPS限制为100
wait_time = eval("lua_script", keys, args)
```

```lua
local key = KEYS[1] -- 限频的key
local consume_permit = tonumber(ARGV[1]) -- 所取走的令牌数
local curr_time = tonumber(ARGV[2]) -- 当前时间，毫秒
local max_wait = tonumber(ARGV[3]) -- 最大等待时间，毫秒
local bucket_cap = tonumber(ARGV[4]) -- 令牌桶容量
local period = tonumber(ARGV[5]) -- 周期，毫秒。即假若桶是空的，经过一个周期，桶就能被填满
local rate = bucket_cap / period -- 速率，每毫秒生成的令牌数量

-- key的数据结构是hash，如有，保存着上次取令牌的时间和剩余令牌数
local limit = redis.pcall("HMGET", key, "last_time", "curr_permit")
local last_time = tonumber(limit[1]) or 0
local curr_permit = tonumber(limit[2]) or 0

-- 计算当前令牌数量
local new_permit = math.floor((curr_time-last_time)*rate) -- 上次取令牌到现在为止，新增了多少令牌
local total_permit = curr_permit + new_permit -- 现在桶里有多少令牌
if bucket_cap < total_permit then
    total_permit = bucket_cap
end

-- 延迟时间判断
local wait_time = 0
if consume_permit <= total_permit then
    -- 如果当前桶里牌数大于要取走的牌数，直接取就好
    total_permit = total_permit - consume_permit
    redis.pcall("HMSET", key, "curr_permit", total_permit, "last_time", curr_time)
else
    wait_time = (consume_permit-total_permit)/rate -- 需要多久才能生成这些透支的令牌
    if max_wait < wait_time then
        wait_time = -wait_time -- 返回<0，代表超出延迟时间，被拦截
    else
        total_permit = total_permit - consume_permit
        redis.pcall("HMSET", key, "curr_permit", total_permit, "last_time", curr_time)
    end
end

return wait_time
```

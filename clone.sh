#!/bin/bash
pids=`ps -ef | grep cloneArticle | grep -v grep  | cut -c 9-15`
for pid in $pids
do
    kill -s 9 $pid
done
nohup node cloneArticle.js true >clone.log 2>&1 &
#!/bin/bash
pids=`ps -ef | grep blog-vue | grep -v grep  | cut -c 9-15`
for pid in $pids
do
    kill -s 9 $pid
done
nohup npm start >start.log 2>&1 &
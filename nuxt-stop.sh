#!/bin/bash
echo 'search blog-vue process'
pids=`ps -ef | grep blog-vue | grep -v grep  | cut -c 9-15`
echo 'will kill blog-vue process: '$pids
for pid in $pids
do
    echo 'killing pid: '$pid
    kill -s 9 $pid
    echo 'success kill pid: '$pid
done
#!/bin/bash
echo 'search clone git process'
pwd=`pwd`
pids=`ps -ef | grep $pwd | grep -v grep  | cut -c 9-15`
echo 'will kill clone git process: '$pids
for pid in $pids
do
    echo 'killing pid: '$pid
    kill -s 9 $pid
    echo 'success kill pid: '$pid
done
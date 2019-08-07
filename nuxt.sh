#!/usr/bin/env bash
function start() {
    stop
    pwd=`pwd`
    echo 'starting '$pwd' process'
    nohup npm start >nuxt.log 2>&1 &
    echo 'success start '$pwd' process'
}

function stop() {
    pwd=`pwd`
    echo 'search '$pwd' process'
    pids=`ps -ef | grep $pwd | grep -v grep  | cut -c 9-15`
    echo 'will kill '$pwd' process: '$pids
    for pid in $pids
    do
        echo 'killing pid: '$pid
        kill -s 9 $pid
        echo 'success kill pid: '$pid
    done
}

function status() {
    pwd=`pwd`
    echo 'search '$pwd' process'
    pids=`ps -ef | grep $pwd | grep -v grep  | cut -c 9-15`
    echo $pwd' process: '$pids
}

if [ "$1"x = "start"x ]; then
    start
fi
if [ "$1"x = "stop"x ]; then
    stop
fi
if [ "$1"x = "status"x ]; then
    status
fi
echo 'please input type:start,stop,status'
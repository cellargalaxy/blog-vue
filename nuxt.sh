#!/usr/bin/env bash
function start() {
    stop
    pwd=`pwd`
    cmd=$pwd'/nuxt.sh'
    echo 'starting nuxt process: '$cmd
    nohup $cmd run >nuxt.log 2>&1 &
    echo 'success start nuxt process: '$cmd
}

function run() {
    echo 'nuxt run cmd: npm start'
    npm start
}

function stop() {
    pwd=`pwd`
    cmd=$pwd'/nuxt.sh'
    echo 'search nuxt process: '$cmd
    pids=`ps -ef | grep $cmd | grep run | grep -v grep  | cut -c 9-15`
    echo 'will kill nuxt process: '$pids
    for pid in $pids
    do
        echo 'killing pid: '$pid
        kill -s 9 $pid
        echo 'success kill pid: '$pid
    done
}

function status() {
    pwd=`pwd`
    cmd=$pwd'/nuxt.sh'
    echo 'search nuxt process: '$cmd
    pids=`ps -ef | grep $cmd | grep run | grep -v grep  | cut -c 9-15`
    echo 'nuxt process: '$pids
}

if [ "$1"x = "start"x ]; then
    start
elif [ "$1"x = "stop"x ]; then
    stop
elif [ "$1"x = "status"x ]; then
    status
elif [ "$1"x = "run"x ]; then
    run
else
    echo 'please input type:start,stop,status,run'
fi
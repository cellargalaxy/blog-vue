#!/usr/bin/env bash
function start() {
    stop
    pwd=`pwd`
    echo 'starting nuxt process: '$pwd
    nohup npm start >nuxt.log 2>&1 &
    echo 'success start nuxt process: '$pwd
}

function run() {
    echo 'nuxt run cmd: npm start'
    npm start
}

function stop() {
    pwd=`pwd`
    echo 'search nuxt process: '$pwd
    pids=`ps -ef | grep $pwd | grep 'node_modules/.bin/nuxt start' | grep -v grep  | cut -c 9-15`
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
    echo 'search nuxt process: '$pwd
    pids=`ps -ef | grep $pwd | grep 'node_modules/.bin/nuxt start' | grep -v grep  | cut -c 9-15`
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
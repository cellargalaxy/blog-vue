#!/usr/bin/env bash
function start() {
    stop
    pwd=`pwd`
    cmd=$pwd'/generate.sh'
    echo 'starting generate process: '$cmd
    nohup $cmd run >generate.log 2>&1 &
    echo 'success start generate process: '$cmd
}

function run() {
    sleepCmd='sleep 27m'
    while :
    do
        echo 'generate run cmd: node cloneArticle.js'
        node cloneArticle.js
        echo 'generate run cmd: npm run generate'
        npm run generate
        echo 'generate run cmd: rm -rf out'
        rm -rf out
        echo 'generate run cmd: cp -r dist out'
        cp -r dist out
        echo 'generate run cmd success, '$sleepCmd
        $sleepCmd
    done
}

function stop() {
    pwd=`pwd`
    cmd=$pwd'/generate.sh'
    echo 'search generate process: '$cmd
    pids=`ps -ef | grep $cmd | grep run | grep -v grep  | cut -c 9-15`
    echo 'will kill generate process: '$pids
    for pid in $pids
    do
        echo 'killing pid: '$pid
        kill -s 9 $pid
        echo 'success kill pid: '$pid
    done
}

function status() {
    pwd=`pwd`
    cmd=$pwd'/generate.sh'
    echo 'search generate process: '$cmd
    pids=`ps -ef | grep $cmd | grep run | grep -v grep  | cut -c 9-15`
    echo 'generate process: '$pids
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

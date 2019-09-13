#!/usr/bin/env bash
function start() {
    stop
    pwd=`pwd`
    cmd=$pwd'/generate.sh'
    echo 'starting generate process: '$cmd
    nohup $cmd run >generate.log 2>&1 &
    echo 'success start generate process: '$cmd
}

function one() {
    echo 'generate run cmd: ./clone.sh one'
    ./clone.sh one
    echo 'generate run cmd: npm run generate'
    npm run generate
    echo 'generate run cmd: rm -rf out'
    rm -rf out
    echo 'generate run cmd: cp -r dist out'
    cp -r dist out
}

function run() {
    sleepCmd='sleep 53m'
    while :
    do
        one
        echo 'generate run cmd sleep, '$sleepCmd
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
elif [ "$1"x = "one"x ]; then
    one
else
    echo 'please input type:start,stop,status,run,one'
fi

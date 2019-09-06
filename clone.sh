#!/usr/bin/env bash
function start() {
    stop
    pwd=`pwd`
    cmd=$pwd'/clone.sh'
    echo 'starting clone git process: '$cmd
    nohup $cmd run >clone.log 2>&1 &
    echo 'success start clone git process: '$cmd
}

function run() {
    pwd=`pwd`
    cmd='node '$pwd'/cloneArticle.js'
    sleepCmd='sleep 7m'
    while :
    do
        echo 'clone git run cmd: '$cmd
        $cmd
        echo 'clone git run cmd success, '$sleepCmd
        $sleepCmd
    done
}

function stop() {
    pwd=`pwd`
    cmd=$pwd'/clone.sh'
    echo 'search clone git process: '$cmd
    pids=`ps -ef | grep $cmd | grep run | grep -v grep  | cut -c 9-15`
    echo 'will kill clone git process: '$pids
    for pid in $pids
    do
        echo 'killing pid: '$pid
        kill -s 9 $pid
        echo 'success kill pid: '$pid
    done
}

function status() {
    pwd=`pwd`
    cmd=$pwd'/clone.sh'
    echo 'search clone git process: '$cmd
    pids=`ps -ef | grep $cmd | grep run | grep -v grep  | cut -c 9-15`
    echo 'clone git process: '$pids
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
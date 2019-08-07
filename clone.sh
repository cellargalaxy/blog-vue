#!/usr/bin/env bash
function start() {
    stop
    pwd=`pwd`
    echo 'starting clone git process: '$pwd
    nohup node $pwd'/cloneArticle.js' true >clone.log 2>&1 &
    echo 'success start clone git process: '$pwd
}

function stop() {
    pwd=`pwd`
    echo 'search clone git process: '$pwd
    pids=`ps -ef | grep $pwd | grep -v grep  | cut -c 9-15`
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
    echo 'search clone git process: '$pid
    pids=`ps -ef | grep $pwd | grep -v grep  | cut -c 9-15`
    echo 'clone git process: '$pids
}

if [ "$1"x = "start"x ]; then
    start
elif [ "$1"x = "stop"x ]; then
    stop
elif [ "$1"x = "status"x ]; then
    status
else
    echo 'please input type:start,stop,status'
fi
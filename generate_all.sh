#!/usr/bin/env bash
function start() {
    stop
    pwd=`pwd`
    cmd=$pwd'/generate_all.sh'
    echo 'starting generate_all process: '$cmd
    nohup $cmd run >generate_all.log 2>&1 &
    echo 'success start generate_all process: '$cmd
}

function generate_all() {
    for file_name in `ls .`
    do
        if [[ $file_name == blog-* ]];
        then
            echo 'generate_all run cmd: '$file_name'/generate.sh run'
            echo 'generate_all run cmd: sleep 5'
            sleep 5
            cd $file_name
            ./generate.sh run
            cd ..
            echo 'generate_all run cmd: sleep 5'
            sleep 5
        fi
    done
}

function run() {
    sleepCmd='sleep 27m'
    while :
    do
        generate_all
        echo 'generate run cmd success, '$sleepCmd
        $sleepCmd
    done
}


function stop() {
    pwd=`pwd`
    cmd=$pwd'/generate_all.sh'
    echo 'search generate_all process: '$cmd
    pids=`ps -ef | grep $cmd | grep run | grep -v grep  | cut -c 9-15`
    echo 'will kill generate_all process: '$pids
    for pid in $pids
    do
        echo 'killing pid: '$pid
        kill -s 9 $pid
        echo 'success kill pid: '$pid
    done
}

function status() {
    pwd=`pwd`
    cmd=$pwd'/generate_all.sh'
    echo 'search generate_all process: '$cmd
    pids=`ps -ef | grep $cmd | grep run | grep -v grep  | cut -c 9-15`
    echo 'generate_all process: '$pids
}


if [ "$1"x = "start"x ]; then
    start
elif [ "$1"x = "stop"x ]; then
    stop
elif [ "$1"x = "status"x ]; then
    status
elif [ "$1"x = "run"x ]; then
    run
elif [ "$1"x = "generate_all"x ]; then
    generate_all
else
    echo 'please input type:start,stop,status,run,generate_all'
fi

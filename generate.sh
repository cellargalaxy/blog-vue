#!/usr/bin/env bash
if [ -z $sleepTime ];then
    sleepTime="3600"
fi
node git_clone_pull.js clone
while :
do
    node git_clone_pull.js copyStatusFile
    npm run generate
    node git_clone_pull.js removeStatusFile
    node git_clone_pull.js remove out
    node git_clone_pull.js copy dist out
    sleep $sleepTime
    node git_clone_pull.js pull
done
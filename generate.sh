#!/usr/bin/env bash
if [ -z $sleepTime ];then
    sleepTime="3600"
fi
nohup node ./node_modules/http-server/bin/http-server -g -c$sleepTime >http.log 2>&1 &
node git_clone_pull.js clone
while :
do
    node git_clone_pull.js copyStatusFile
    npm run generate
    node git_clone_pull.js removeStatusFile
    node git_clone_pull.js remove public
    node git_clone_pull.js copy dist public
    sleep $sleepTime
    node git_clone_pull.js pull
done
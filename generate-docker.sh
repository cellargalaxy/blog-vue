#!/usr/bin/env bash
if [ -z $SLEEP_TIME ];then
    SLEEP_TIME="3600"
fi
node build_init.js clone
node build_init.js copyConfigFile
node build_init.js copyStatusFile
node build_init.js downloadStatic
npm run generate
node build_init.js removeStatusFile
node build_init.js remove public
node build_init.js copy dist public
nohup node ./node_modules/http-server/bin/http-server -g true -d false >http.log 2>&1 &
while :
do
    sleep $SLEEP_TIME
    node build_init.js pull
    node build_init.js copyConfigFile
    node build_init.js copyStatusFile
    node build_init.js downloadStatic
    npm run generate
    node build_init.js removeStatusFile
    node build_init.js remove public
    node build_init.js copy dist public
done
#!/bin/bash
while :
do
    read -p "please enter git url(required):" gitUrl
    if [ ! -z $gitUrl ];then
        break
    fi
done
read -p "please enter git ref(default:master):" ref
if [ -z $ref ];then
    ref="master"
fi
read -p "please enter username(optional):" username
if [ -z $username ];then
    username=""
fi
read -s -p "please enter password(optional):" password
if [ -z $password ];then
    password=""
fi
read -p "please enter flushTime(default:600000:10min):" flushTime
if [ -z $flushTime ];then
    flushTime="600000"
fi
bootConfig='{
  "gitUrl": "'$gitUrl'",
  "ref": "'$ref'",
  "username": "'$username'",
  "password": "'$password'",
  "flushTime": '$flushTime',
  "repositoryPath": "static/repository"
}'
echo $bootConfig
echo 'boot config,input any key go on,or control+c over'
read
echo $bootConfig > bootConfig.json
rm -rf node_modules
rm -rf .nuxt
npm i
node cloneArticle.js false
npm run build

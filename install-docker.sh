#!/usr/bin/env bash
while :
do
    read -p "please enter git url(required):" GIT_URL
    if [ ! -z $GIT_URL ];then
        break
    fi
done
read -p "please enter git ref(default:master):" GIT_REF
if [ -z $GIT_REF ];then
    GIT_REF="master"
fi
read -p "please enter git username(default:''):" GIT_USERNAME
if [ -z $GIT_USERNAME ];then
    GIT_USERNAME=""
fi
read -s "please enter git password(default:''):" GIT_PASSWORD
if [ -z $GIT_PASSWORD ];then
    GIT_PASSWORD=""
fi
read -p "please enter sleepTime(default:3600):" sleepTime
if [ -z $sleepTime ];then
    sleepTime="3600"
fi
read -p "please enter listen port(default:8888):" listenPort
if [ -z $listenPort ];then
    listenPort="8888"
fi

echo 'git url: '$GIT_URL
echo 'git ref: '$GIT_REF
echo 'git username: '$GIT_USERNAME
echo 'sleepTime: '$sleepTime
echo 'listenPort: '$listenPort
echo 'input any key go on,or control+c over'
read

echo 'docker build'
docker build -t blog_vue .
echo 'docker create volume'
docker volume create blog_vue
echo 'docker run'
docker run -d --restart=always --name blog_vue -p $listenPort:8080 -v blog_vue:/src/public -e GIT_URL=$GIT_URL -e GIT_REF=$GIT_REF -e GIT_USERNAME=$GIT_USERNAME -e GIT_PASSWORD=$GIT_PASSWORD -e sleepTime=$sleepTime blog_vue

echo 'all finish'

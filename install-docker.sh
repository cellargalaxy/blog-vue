#!/usr/bin/env bash
while :; do
  if [ ! -z $GIT_URL ]; then
    break
  fi
  read -p "please enter git url(required):" GIT_URL
done

if [ -z $GIT_REF ]; then
  read -p "please enter git ref(default:'master'):" GIT_REF
fi
if [ -z $GIT_REF ]; then
  GIT_REF="master"
fi

read -p "please enter git username(default:''):" GIT_USERNAME
if [ -z $GIT_USERNAME ]; then
  GIT_USERNAME=""
fi

read -p "please enter git password(default:''):" -s GIT_PASSWORD
if [ -z $GIT_PASSWORD ]; then
  GIT_PASSWORD=""
fi

if [ -z $SLEEP_TIME ]; then
  read -p "please enter sleepTime(default:3600):" SLEEP_TIME
fi
if [ -z $SLEEP_TIME ]; then
  SLEEP_TIME="3600"
fi

if [ -z $LISTEN_PORT ]; then
  read -p "please enter listen port(default:8888):" LISTEN_PORT
fi
if [ -z $LISTEN_PORT ]; then
  LISTEN_PORT="8888"
fi

if [ -z $CONTAINER_NAME ]; then
  read -p "please enter container name(default:'blog_vue'):" CONTAINER_NAME
fi
if [ -z $CONTAINER_NAME ]; then
  CONTAINER_NAME="blog_vue"
fi

echo 'git url: '$GIT_URL
echo 'git ref: '$GIT_REF
echo 'git username: '$GIT_USERNAME
echo 'container name: '$CONTAINER_NAME
echo 'sleep time: '$SLEEP_TIME
echo 'listen port: '$LISTEN_PORT
echo 'input any key go on,or control+c over'
read

echo 'docker build'
docker build -t blog_vue .
echo 'docker create volume'
docker volume create $CONTAINER_NAME
echo 'docker run'
docker run -d \
  --restart=always \
  --name $CONTAINER_NAME \
  -p $LISTEN_PORT:8080 \
  -v $CONTAINER_NAME:/src/generate \
  -e GIT_URL=$GIT_URL \
  -e GIT_REF=$GIT_REF \
  -e GIT_USERNAME=$GIT_USERNAME \
  -e GIT_PASSWORD=$GIT_PASSWORD \
  -e SLEEP_TIME=$SLEEP_TIME \
  blog_vue

echo 'all finish'

#!/usr/bin/env bash
if [ -z $SLEEP_TIME ]; then
  SLEEP_TIME="3600"
fi
node build_init.js clone
node build_init.js copyConfigFile
node build_init.js copyStatusFile
node build_init.js downloadStatic
npm run generate
node build_init.js removeStatusFile
mkdir -p public-back
if [ -d "public-back" ]; then
  rm -rf public-back/*
fi
if [ -d "public" ]; then
  mv public/* public-back/*
fi
if [ -d "dist" ]; then
  mv dist/* public/*
elif [ -d "public-back" ]; then
  mv public-back/* public/*
fi
nohup node ./node_modules/http-server/bin/http-server -g true -d false -c-1 >/tmp/http.log 2>&1 &
while :; do
  echo 'sleep '$SLEEP_TIME
  sleep $SLEEP_TIME
  node build_init.js pull
  if [ $? -eq 0 ]; then
    continue
  fi
  node build_init.js copyConfigFile
  node build_init.js copyStatusFile
  node build_init.js downloadStatic
  npm run generate
  node build_init.js removeStatusFile
  if [ -d "public-back" ]; then
    rm -rf public-back/*
  fi
  if [ -d "public" ]; then
    mv public/* public-back/*
  fi
  if [ -d "dist" ]; then
    mv dist/* public/*
  elif [ -d "public-back" ]; then
    mv public-back/* public/*
  fi
done

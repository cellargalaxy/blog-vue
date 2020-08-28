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
mkdir -p generate
rm -rf generate/public_back
if [ -d "generate/public" ]; then
  mv generate/public generate/public_back
fi
rm -rf generate/public
if [ -d "dist" ]; then
  mv dist generate/public
elif [ -d "generate/public_back" ]; then
  mv generate/public_back generate/public
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
  rm -rf generate/public_back
  if [ -d "generate/public" ]; then
    mv generate/public generate/public_back
  fi
  rm -rf generate/public
  if [ -d "dist" ]; then
    mv dist generate/public
  elif [ -d "generate/public_back" ]; then
    mv generate/public_back generate/public
  fi
done

#!/usr/bin/env bash
node build_init.js copyConfigFile
node build_init.js copyStatusFile
npm run generate
node build_init.js removeStatusFile
if [ -d "public-back" ]; then
  rm -rf public-back
fi
if [ -d "public" ]; then
  mv public public-back
fi
if [ -d "dist" ]; then
  mv dist public
elif [ -d "public-back" ]; then
  mv public-back public
fi
node ./node_modules/http-server/bin/http-server -g true -c-1 -d false

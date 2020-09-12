#!/usr/bin/env bash
node build_init.js copyConfigFile
node build_init.js copyStatusFile
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
node ./node_modules/http-server/bin/http-server generate/public -g true -d false -c-1

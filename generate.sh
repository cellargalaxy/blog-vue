#!/usr/bin/env bash
while :; do
  if [ ! -z $GIT_URL ]; then
    break
  fi
  read -p "please enter git url(required):" GIT_URL
done
export GIT_URL=$GIT_URL

if [ -z $GIT_REF ]; then
  read -p "please enter git ref(default:'master'):" GIT_REF
fi
if [ -z $GIT_REF ]; then
  GIT_REF="master"
fi
export GIT_REF=$GIT_REF

if [ -z $GIT_USERNAME ]; then
  read -p "please enter git username(default:''):" GIT_USERNAME
fi
if [ -z $GIT_USERNAME ]; then
  GIT_USERNAME=""
fi
export GIT_USERNAME=$GIT_USERNAME

if [ -z $GIT_PASSWORD ]; then
  read -p "please enter git password(default:''):" -s GIT_PASSWORD
fi
if [ -z $GIT_PASSWORD ]; then
  GIT_PASSWORD=""
fi
export GIT_PASSWORD=$GIT_PASSWORD

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
node ./node_modules/http-server/bin/http-server generate/public -g true -c-1 -d false

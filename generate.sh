#!/usr/bin/env bash
while :
do
    if [ ! -z $GIT_URL ];then
        break
    fi
    read -p "please enter git url(required):" GIT_URL
done
read -p "please enter git ref(default:'master'):" GIT_REF
if [ -z $GIT_REF ];then
    GIT_REF="master"
fi
read -p "please enter git username(default:''):" GIT_USERNAME
if [ -z $GIT_USERNAME ];then
    GIT_USERNAME=""
fi
read -p "please enter git password(default:''):" -s GIT_PASSWORD
if [ -z $GIT_PASSWORD ];then
    GIT_PASSWORD=""
fi

node git_clone_pull.js clone
node git_clone_pull.js copyStatusFile
npm run generate
node git_clone_pull.js removeStatusFile
node git_clone_pull.js remove public
node git_clone_pull.js copy dist public
node ./node_modules/http-server/bin/http-server -g true -c-1 -d false

#!/bin/bash
./nuxt-stop.sh
echo 'starting blog-vue process'
nohup npm start >start.log 2>&1 &
echo 'success start blog-vue process'
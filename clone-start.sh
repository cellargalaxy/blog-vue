#!/bin/bash
./clone-stop.sh
echo 'starting clone git process'
pwd=`pwd`
nohup node $pwd'/cloneArticle.js' true >clone.log 2>&1 &
echo 'success start clone git process'
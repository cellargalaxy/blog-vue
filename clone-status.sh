#!/bin/bash
echo 'search clone git process'
pids=`ps -ef | grep cloneArticle | grep -v grep  | cut -c 9-15`
echo 'clone git process: '$pids
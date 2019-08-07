#!/bin/bash
echo 'search blog-vue process'
pwd=`pwd`
pids=`ps -ef | grep $pwd | grep -v grep  | cut -c 9-15`
echo 'blog-vue process: '$pids
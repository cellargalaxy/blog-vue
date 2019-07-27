#!/bin/bash
echo 'search blog-vue process'
pids=`ps -ef | grep blog-vue | grep -v grep  | cut -c 9-15`
echo 'blog-vue process: '$pids
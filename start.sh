#!/bin/bash
ps -ef | grep blog-vue | grep -v grep  | cut -c 9-15 | xargs kill -s 9
nohup npm start >start.log 2>&1 &
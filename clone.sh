#!/bin/bash
ps -ef | grep cloneArticle | grep -v grep  | cut -c 9-15 | xargs kill -s 9
nohup node cloneArticle.js true >clone.log 2>&1 &
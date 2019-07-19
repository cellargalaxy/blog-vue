#!/bin/bash
nohup npm start >start.log 2>&1 &
nohup node assets/clone/articleClone.js >clone.log 2>&1 &
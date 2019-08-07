#!/bin/bash
echo 'search clone git process'
pwd=`pwd`
pids=`ps -ef | grep $pwd | grep -v grep  | cut -c 9-15`
echo 'clone git process: '$pids
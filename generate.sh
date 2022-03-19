#!/usr/bin/env bash

nuxt generate
mkdir -p blog-vue
rm -rf blog-vue/*
cp -r dist/* blog-vue

#!/usr/bin/env bash

rm -rf dist
/bin/cp -rf App.js node_modules/@nuxt/vue-app/template/App.js
nuxt generate

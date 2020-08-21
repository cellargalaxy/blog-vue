#!/usr/bin/env bash
node build_init.js copyConfigFile
node build_init.js copyStatusFile
npm run generate
node build_init.js removeStatusFile
node build_init.js remove public
node build_init.js copy dist public
node ./node_modules/http-server/bin/http-server -g true -c-1 -d false

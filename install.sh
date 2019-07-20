#!/bin/bash
rm -rf node_modules
rm -rf .nuxt
npm i
node articleClone.js false
npm run build
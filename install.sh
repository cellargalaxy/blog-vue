#!/bin/bash
rm -rf node_modules
rm -rf .nuxt
npm i
node cloneArticle.js false
npm run build
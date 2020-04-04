<template>
  <b-card class="text-center blue-background-8" style="border:none;">
    <b-card-text :key="i" class="white" v-for="(contents,i) in config.rowContents">
      <b-badge class="transparent" style="margin-left: 0.5em;margin-right: 0.5em;"
               v-for="(content,j) in contents" :key="j">
        <a class="white" target="_blank" v-text="content.text" :href="content.url"/>
      </b-badge>
    </b-card-text>
    <b-card-text class="white">
      <b-badge class="transparent">built on {{buildTimeString}}</b-badge>
    </b-card-text>
  </b-card>
</template>

<page-foot :buildTimeString="buildTimeString" :config="config"/>

<script>
  import utils from '../middleware/utils/utils'

  export default {
    name: "pageFoot",
    props: {
      config: {
        default() {
          return {
            "buildTimeFormat": "yyyy-MM-dd hh:mm",
            "rowContents": [
              [
                {"text": "Copyright © 2017-? ."},
                {"text": "备案？不存在的"},
                {"text": "Powered by Nuxt.js & Github", "url": "https://github.com/"}
              ],
              [
                {"text": "友链："},
                {"text": "Github", "url": "https://github.com/"},
                {"text": "Nuxt.js", "url": "https://zh.nuxtjs.org"}
              ]
            ]
          }
        }
      },
      buildTimeString: {
        default() {
          return utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
        }
      },
    },
  }
</script>

<style scoped>
  .blue-background-8 {
    background-color: rgba(84, 155, 196, 0.8);
    border-color: rgba(84, 155, 196, 0.8);
  }

  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .white {
    color: rgba(255, 255, 255, 1);
  }
</style>

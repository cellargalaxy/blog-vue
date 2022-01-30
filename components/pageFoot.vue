<template>
  <b-card class="text-center blue-background-8" style="border:none;">
    <b-card-text v-for="(line,i) in config.lines" :key="i" class="white">

      <b-badge v-for="(content,j) in line" :key="j"
               class="transparent" style="margin-left: 0.5em;margin-right: 0.5em;">
        <a :href="content.url" class="white" target="_blank" v-text="content.text"/>
      </b-badge>

    </b-card-text>
  </b-card>
</template>

<page-foot :config="config"/>

<script>
export default {
  name: "pageFoot", //页尾
  props: {
    config: {
      default() {
        return {
          "lines": [
            [
              {"text": "Copyright © 2017-? ."},
              {"text": "备案？不存在的"},
              {"text": "Powered by Nuxt.js & Github"}
            ],
            [
              {"text": "友链："},
              {"text": "Github", "url": "https://github.com/"},
              {"text": "Nuxt.js", "url": "https://nuxtjs.org/"}
            ]
          ]
        }
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

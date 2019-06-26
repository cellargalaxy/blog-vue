<template>
  <b-button-group vertical class="goto" size="sm">
    <b-button @click="gotoTop" class="translucent gray"><b>{{config.gotoTopText}}</b></b-button>

    <b-button v-for="(content,contentIndex) in config.contents?config.contents:[]" :key="contentIndex" class="translucent">
      <b-link target="_blank" :href="content.url" class="gray"><b>{{content.text}}</b></b-link>
    </b-button>

    <b-button @click="gotoBottom" class="translucent gray"><b>{{config.gotoBottomText}}</b></b-button>
  </b-button-group>
</template>

<goto/>

<script>
  import configService from '../assets/service/configService'

  export default {
    name: "goto",
    computed: {
      config: function () {
        return configService.getGotoConfig()
      }
    },
    methods: {
      gotoTop: function () {
        let timer = null;
        cancelAnimationFrame(timer);
        //获取当前毫秒数
        let startTime = +new Date();
        //获取当前页面的滚动高度
        let b = document.body.scrollTop || document.documentElement.scrollTop;
        let d = 500;
        let c = b;
        timer = requestAnimationFrame(function func() {
          let t = d - Math.max(0, startTime - (+new Date()) + d);
          document.documentElement.scrollTop = document.body.scrollTop = t * (-c) / d + b;
          timer = requestAnimationFrame(func);
          if (t == d) {
            cancelAnimationFrame(timer);
          }
        });
      },
      gotoBottom: function () {
        window.scrollTo(0, document.body.clientHeight || document.documentElement.clientHeight);
      },
    },
  }
</script>

<style scoped>
  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }

  .goto {
    position: fixed;
    bottom: 3em;
    right: 1em;
    z-index: 9999;
  }

  .gray {
    color: rgba(51, 51, 51, 0.7);
  }
</style>

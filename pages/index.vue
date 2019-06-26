<template>
  <div>
    <h2 :style="{'font-size': fontSize,'font-style':fontStyle,'text-shadow':textShadow}" @mouseenter="mouseenter"
        @mouseleave="mouseleave" class="white"
        v-if="config.brandHello">
      <b>{{config.brandHello}}</b>
    </h2>
    <b-card class="translucent-black"
            v-if="(config.brandTexts&&config.brandTexts.length>0)||(config.navs&&config.navs.length>0)">
      <p :key="brandTextsIndex"
         class="white" v-for="(brandText,brandTextsIndex) in config.brandTexts"
         v-if="config.brandTexts&&config.brandTexts.length>0">
        {{brandText}}</p>

      <b-nav align="center" class="transparent" v-if="config.navs&&config.navs.length>0">
        <b-nav-item :href="nav.url" :key="navIndex" target="_blank" v-for="(nav,navIndex) in config.navs">
          {{nav.text}}
        </b-nav-item>
      </b-nav>
    </b-card>
  </div>
</template>

<script>
  import configService from '../assets/service/configService'

  export default {
    name: "index",
    data() {
      return {
        isItalic: false,
      }
    },
    computed: {
      config: function () {
        return configService.getHomeConfig()
      },
      fontSize: function () {
        return (100 / this.config.brandHello.length) + 'vw'
      },
      fontStyle: function () {
        return this.isItalic ? 'italic' : 'normal'
      },
      textShadow: function () {
        return this.isItalic ? (Math.random() > 0.5 ? '0.08em 0em 0.05em orangered' : '0.08em 0em 0.05em dodgerblue') : ''
      },
    },
    methods: {
      mouseenter: function () {
        this.isItalic = true
      },
      mouseleave: function () {
        this.isItalic = false
      },
    },
    layout: 'home',
  }
</script>

<style scoped>
  .white {
    color: rgba(255, 255, 255, 1);
  }

  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .translucent-black {
    background-color: rgba(0, 0, 0, 0.5);
    border-color: rgba(0, 0, 0, 0);
  }
</style>


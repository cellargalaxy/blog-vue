<template>
  <b-card class="text-center translucent">
    <b-nav>
      <b-nav-item @click="flushBackgroundImage">
        <b>&lt;</b>
      </b-nav-item>

      <b-nav-item v-for="(nav,navIndex) in navs" :key="navIndex" :href="nav.path"
                  @mouseenter="mouseenter(navIndex)" @mouseleave="mouseleave(navIndex)">
        <b>{{nav.name}}</b>
      </b-nav-item>

      <b-nav-item @click="flushBackgroundImage">
        <b>&gt;</b>
      </b-nav-item>
    </b-nav>
  </b-card>
</template>

<fool-nav :navs="navs" :restoreTime="restoreTime" :isFool="isFool"/>

<script>
  import {Base64} from 'js-base64'

  export default {
    name: "foolNav",
    props: {
      navs: {
        default: function () {
          return [{"path": "/1", "name": "一个分类"}, {"path": "/2", "name": "两个分类"}]
        }
      },
      restoreTime: {
        default: function () {
          return 3000
        }
      },
      isFool: {
        default: function () {
          return false
        }
      },
    },
    data() {
      return {
        timeout: null,
      }
    },
    watch: {
      navs(val) {
        for (let i = 0; i < val.length; i++) {
          val[i].path0 = val[i].path
          val[i].name0 = val[i].name
          val[i].base64 = Base64.encode(val[i].name)
        }
      },
    },
    created: function () {
      for (let i = 0; i < this.navs.length; i++) {
        this.navs[i].path0 = this.navs[i].path
        this.navs[i].name0 = this.navs[i].name
        this.navs[i].base64 = Base64.encode(this.navs[i].name)
      }
    },
    methods: {
      mouseenter: function (navIndex) {
        if (this.isFool) {
          this.navs[navIndex].path = this.navs[navIndex].base64
        }
        this.navs[navIndex].name = this.navs[navIndex].base64
        var self = this
        this.timeout = setTimeout(function () {
          self.navs[navIndex].name = self.navs[navIndex].name0
          self.navs[navIndex].path = self.navs[navIndex].path0
        }, this.restoreTime);
      },
      mouseleave: function (navIndex) {
        if (this.timeout != null) {
          clearTimeout(this.timeout);
        }
        this.navs[navIndex].name = this.navs[navIndex].name0
        this.navs[navIndex].path = this.navs[navIndex].path0
      },
      flushBackgroundImage: function () {
        flushBackgroundImage()
      },
    },
  }
</script>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
  }
</style>

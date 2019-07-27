<template>
  <b-navbar toggleable="sm" fixed="top" :class="{low_translucent:show,transparent:!show}"
            @mouseenter="mouseenter" @mouseleave="mouseleave" style="height: 5em;">
    <b-navbar-brand :class="{translucent:!show,transparent:show}" :href="config.brandUrl"
                    style="border-radius: 0.5em;padding: 0.2em;">
      <b class="gray">{{config.brandText}}</b>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" :class="{translucent:!show,transparent:show}" @click="click"/>

    <b-collapse id="nav-collapse" :class="{low_translucent:clickShow,transparent:!show}" is-nav>
      <b-container>
        <b-row align-h="center">
          <b-navbar-nav align="center">
            <b-nav-item :key="navIndex" v-for="(nav,navIndex) in config.navs?config.navs:[]"
                        :href="nav.url" style="margin-left: 0.5em;margin-right: 0.5em;">
              <b :class="{gray:show,translucent_word:!show}">{{nav.text}}</b>
            </b-nav-item>
          </b-navbar-nav>
        </b-row>
      </b-container>
    </b-collapse>
  </b-navbar>
</template>

<navbar :config="config"/>

<script>

  export default {
    name: "navbar",
    props: {
      config: {
        default: function () {
          return null
        }
      },
    },
    data() {
      return {
        show: false,
        clickShow: false,
      }
    },
    methods: {
      click: function () {
        this.clickShow = !this.clickShow
      },
      mouseenter: function () {
        this.show = true
      },
      mouseleave: function () {
        this.show = false
      },
    },
  }
</script>

<style scoped>
  .transparent {
    background-color: rgba(255, 255, 255, 0);
    border-color: rgba(255, 255, 255, 0);
  }

  .translucent {
    background-color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.7);
  }

  .low_translucent {
    background-color: rgba(255, 255, 255, 0.95);
    border-color: rgba(255, 255, 255, 0.95);
  }

  .gray {
    color: rgba(51, 51, 51, 0.7);
  }

  .translucent_word {
    color: rgba(51, 51, 51, 0);
  }

</style>

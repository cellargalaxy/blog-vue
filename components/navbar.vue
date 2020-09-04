<template>
  <b-navbar :class="show?'white-background-8':'transparent'" @mouseenter.native="show=true"
            @mouseleave.native="show=false"
            fixed="top" style="transition: background-color 1000ms"
            toggleable="md">

    <b-navbar-brand :class="show?'transparent':'white-background-6'" :href="config.brandUrl"
                    style="border-radius: 0.5em;padding: 0.2em;transition: background-color 1000ms;" tag="h1">
      <b style="color: rgba(51, 51, 51, 0.7);">{{config.brandText}}</b>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <!--这里的v-if自然是控制是否显示，但是v-show却有式文本渐变出现的功能-->
    <b-collapse id="nav-collapse" is-nav v-if="show" v-show="show">
      <b-navbar-nav align="center">
        <b-nav-item :href="nav.url" :key="i" v-for="(nav,i) in config.navs?config.navs:[]">
          <b>{{nav.text}}</b>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>

  </b-navbar>
</template>

<navbar :config="config"/>

<script>
  export default {
    name: "navbar",
    props: {
      config: {
        default() {
          return {
            "brandText": "主页名",
            "brandUrl": "#",
            "navs": [
              {"text": "导航-1", "url": "#"},
              {"text": "导航-2", "url": "#"},
              {"text": "导航-3", "url": "#"},
              {"text": "导航-4", "url": "#"},
              {"text": "导航-5", "url": "#"},
              {"text": "导航-6", "url": "#"},
              {"text": "导航-7", "url": "#"},
              {"text": "导航-8", "url": "#"},
              {"text": "导航-9", "url": "#"},
              {"text": "导航-0", "url": "#"},
            ]
          }
        }
      },
    },
    data() {
      return {
        show: false,
      }
    },
  }
</script>

<style scoped>
  /*导航栏居中*/
  .navbar-nav {
    width: 100%;
    text-align: center;
  }

  /*导航栏居中*/
  .navbar-nav li {
    float: none;
    display: inline-block;
    text-align: center;
  }

  .transparent {
    background-color: rgba(255, 255, 255, 0);
  }

  .white-background-6 {
    background-color: rgba(255, 255, 255, 0.6);
  }

  .white-background-8 {
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>

<template>
  <b-navbar :class="show?'white-background-8':'transparent'" fixed="top"
            style="transition: background-color 1000ms"
            toggleable="md" @mouseenter.native="show=true" @mouseleave.native="show=false">

    <b-navbar-brand :class="show?'transparent':'white-background-6'" :href="config.basePath"
                    style="border-radius: 0.5em;padding: 0.2em;transition: background-color 1000ms;" tag="h1">
      <b style="color: rgba(51, 51, 51, 0.7);">{{ config.siteName }}</b>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <!--这里的v-if自然是控制是否显示，但是v-show却有式文本渐变出现的功能-->
    <b-collapse v-if="show" v-show="show" id="nav-collapse" is-nav>
      <b-navbar-nav align="right">
        <b-nav-item v-for="(nav,i) in config.navs?config.navs:[]" :key="i" :href="nav.url">
          <b>{{ nav.text }}</b>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav align="right">
<!--        <b-nav-form>-->
<!--          <b-input-group size="sm">-->
<!--            <b-form-input placeholder="Search" style="background-color: rgba(0, 0, 0, 0);"-->
<!--                          v-model="key" @keyup.enter.native="search"/>-->
<!--            <b-input-group-append>-->
<!--              <b-button variant="outline-secondary" @click="search">Search</b-button>-->
<!--            </b-input-group-append>-->
<!--          </b-input-group>-->
<!--        </b-nav-form>-->
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<navbar :config="config"/>

<script>
import path from 'path'

export default {
  name: "navbar", //导航
  props: {
    config: {
      default() {
        return {
          "siteName": "主页の名",
          "basePath": "#",
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
      key: '',
    }
  },
  methods: {
    search() {
      if (this.key === undefined || this.key == null || this.key === '') {
        return
      }
      window.location.href = path.join(this.config.basePath, '/search/?key=' + this.key)
    },
  },
}
</script>

<style scoped>
/*导航栏居中*/
.navbar-nav {
  width: 100%;
  text-align: center;
}
</style>

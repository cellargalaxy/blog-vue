<template>

  <div>
    <navbar :config="navbarConfig"/>

    <b-container>
      <b-row align-v="center" class="text-center" style="height: 100vh">
        <b-col>

          <h2 :style="{'font-size': fontSize,'font-style':fontStyle,'text-shadow':textShadow}" @mouseenter="mouseenter"
              @mouseleave="mouseleave" class="white"
              v-if="homeConfig.brandHello">
            <b>{{homeConfig.brandHello}}</b>
          </h2>
          <b-card class="translucent-black"
                  v-if="(homeConfig.brandTexts&&homeConfig.brandTexts.length>0)||(homeConfig.navs&&homeConfig.navs.length>0)">
            <p :key="brandTextsIndex"
               class="white" v-for="(brandText,brandTextsIndex) in homeConfig.brandTexts"
               v-if="homeConfig.brandTexts&&homeConfig.brandTexts.length>0">
              {{brandText}}</p>

            <b-nav align="center" class="transparent" v-if="homeConfig.navs&&homeConfig.navs.length>0">
              <b-nav-item :href="nav.url" :key="navIndex" target="_blank" v-for="(nav,navIndex) in homeConfig.navs">
                {{nav.text}}
              </b-nav-item>
            </b-nav>
          </b-card>

        </b-col>
      </b-row>
    </b-container>

    <goto :config="gotoConfig"/>
  </div>

</template>

<script>
  import navbar from '../components/navbar'
  import goto from '../components/goto'
  import configService from '../assets/service/configService'

  export default {
    name: "index",
    async asyncData({params, error}) {
      return {
        homeConfig: configService.getHomeConfig(),
        navbarConfig: configService.getNavbarConfig(),
        gotoConfig: configService.getGotoConfig()
      }
    },
    data() {
      return {
        isItalic: false,
      }
    },
    computed: {
      fontSize: function () {
        return (100 / this.homeConfig.brandHello.length) + 'vw'
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
    components: {
      navbar,
      goto,
    },
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


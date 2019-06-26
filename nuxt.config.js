import configService from './assets/service/configService'
import articleClone from './assets/dao/articleClone'

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: configService.getSiteConfig().siteName,
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: configService.getSiteConfig().description}
    ],
    script: [
      {src: configService.getSiteConfig().globalJsUrl},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: configService.getSiteConfig().faviconUrl},
      {rel: 'stylesheet', href: configService.getSiteConfig().globalCssUrl},
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#fff'},

  /*
  ** Global CSS
  */
  css: [],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
  ],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack configService here
    */
    extend(config, ctx) {
      config.node = {
        'cluster': 'empty',
        'fs': 'empty',
      }
      articleClone.autoCloneRepository()
    }
  },
}

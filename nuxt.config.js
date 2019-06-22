import config from './assets/config'
import articleClone from './assets/dao/articleClone'
import articleService from './assets/service/articleService'

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: config.getSiteConfig().siteName,
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: config.getSiteConfig().description}
    ],
    script: [
      {src: config.getSiteConfig().globalJsUrl},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: config.getSiteConfig().faviconUrl},
      {rel: 'stylesheet', href: config.getSiteConfig().globalCssUrl},
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
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      config.node = {
        'cluster': 'empty',
        'fs': 'empty',
      }
      // articleClone.autoCloneRepository()
      // articleService.autoFlushArticle()
    }
  },
}

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
  css: [
    {src: '~/node_modules/highlight.js/styles/darcula.css', lang: 'css'}
  ],

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
    '@nuxtjs/markdownit',
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
      articleClone.autoPullRepository()
    }
  },

  markdownit: {
    injected: true,
    html: true,         // Enable HTML tags in source
    xhtmlOut: true,         // Use '/' to close single tags (<br />).
                            // This is only for full CommonMark compatibility.
    breaks: false,        // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
                              // useful for external highlighters.
    linkify: false,        // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    typographer: false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '“”‘’',

    use: [
      'markdown-it-highlightjs'
    ]
  }
}

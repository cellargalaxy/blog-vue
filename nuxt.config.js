import util from './utils/util'
import guestArticle from './guestApi/guestArticle'

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'cellargalaxyの博客',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'default_description', name: 'description', content: 'cellargalaxyの博客'}
    ],
    script: [
      {src: '/jquery/3.3.1/jquery.min.js'},
      {src: '/blog.js'},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'stylesheet', href: '/blog.css'},
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#3B8070'},

  modules: [
    'bootstrap-vue/nuxt',

    ['bootstrap-vue/nuxt', {css: false}],

    '@nuxtjs/sitemap',
  ],

  plugins: [
    {src: '~plugins/mavon-editor', ssr: false},
  ],

  sitemap: {
    path: '/sitemap.xml',
    hostname: 'http://www.cellargalaxy.top',
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false, // Enable me when using nuxt generate
    exclude: [
      '/secret',
      '/admin/**'
    ],
    routes(callback) {
      guestArticle.listAllSitemap()
        .then(articles => {
          let routes = articles.map(article => {
            // article.createDate = util.formatTimestamp(article.createDate, 'yyyy-MM-dd')
            return '/article/' + article.createDate + '/' + article.title
          })
          callback(null, routes)
        })
        .catch(callback)
    }
  },

  /*
  ** Build configuration
  */
  build: {
    //任何页面里面引入 axios 而不用担心它会被重复打包
    vendor: ['axios', 'marked', 'js-base64'],
    /*
    ** Run ESLint on save
    */
    extend(config, {isDev}) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
}


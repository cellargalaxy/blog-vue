module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'cellargalaxyの博客',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'cellargalaxyの博客'}
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
  ],

  plugins: [
    {src: '~plugins/mavon-editor', ssr: false},
  ],

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


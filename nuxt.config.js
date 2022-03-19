import service from './middleware/service'

const webpack = require('webpack')

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: service.getSiteConfig().siteName,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    script: [],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/base.css',
    'element-ui/lib/theme-chalk/index.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  //对于只需要在浏览器执行的插件，使用ssr: false
  plugins: [
    {src: '@/plugins/element-ui', ssr: true},
    // {src: '@/plugins/lazysizes', ssr: false},
    // {src: '@/plugins/medium-zoom', ssr: false},
    // {src: '@/plugins/backstretch', ssr: false},
    // {src: '@/plugins/mermaid', ssr: false},
    {src: '@/plugins/plugins', ssr: false},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    vendor: [
      'element-ui',
    ],
    babel: {
      compact: false
    },
    extend(config, ctx) {
      config.node = {
        'cluster': 'empty',
        'fs': 'empty',
        'fs-extra': 'empty',
        'http-server': 'empty',
        'isomorphic-git': 'empty',
        'request': 'empty',
        'moment': 'empty',
        'net': 'empty',
        'fsevents': 'empty',
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery',
        'jQuery': 'jquery',
      })
    ],
  },

  generate: {
    fallback: true,
    routes: listRoute,
  },

  router: {
    base: service.getSiteConfig().basePath
  },

  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-darcula.css'
      },
      remarkPlugins: ['remark-math'],
      rehypePlugins: ['rehype-mathjax'],
    }
  },

  sitemap: {
    hostname: service.getSiteConfig().siteHost,
    path: '/sitemap.xml',
    gzip: true,
    exclude: [],
  },
}

async function listRoute() {
  const {$content} = require('@nuxt/content')
  const contents = await $content('', {deep: true}).fetch()
  const files = service.content2Files(contents)
  const routes = service.listRoute(files)
  return routes
}

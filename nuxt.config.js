import global_config from './global_config'
import configService from './middleware/service/configService'
import fileService from './middleware/service/fileService'

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
      {hid: 'description', name: 'description', content: configService.getSiteConfig().description},
      {
        hid: 'background-image',
        name: 'background-image',
        content: JSON.stringify(configService.getSiteConfig().backgroundImage)
      },
    ],
    script: [
      {src: 'https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js'},
      {src: 'https://cdn.jsdelivr.net/npm/mermaid@8.4.6/dist/mermaid.min.js'},
      {src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js'},
      {src: 'https://cdn.jsdelivr.net/npm/jquery.backstretch@2.1.15/jquery.backstretch.min.js'},
      {src: '/js/zoom.js'},
      {src: '/js/base.js'},
      {src: configService.getSiteConfig().staticJsUrl},
    ],
    link: [
      {rel: 'stylesheet', href: '/css/zoom.css'},
      {rel: 'stylesheet', href: '/css/base.css'},
      {rel: 'icon', type: 'image/x-icon', href: global_config.faviconPath},
      {rel: 'stylesheet', href: configService.getSiteConfig().staticCssUrl},
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
    {src: '~/node_modules/highlight.js/styles/darcula.css', lang: 'css'},
    {src: '~/node_modules/element-ui/lib/theme-chalk/index.css', lang: 'css'},
  ],

  vender: [
    'element-ui'
  ],
  babel: {
    "plugins": [["component", [
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-default"
      },
      'transform-async-to-generator',
      'transform-runtime'
    ]]],
    comments: true
  },
  plugins: [
    {src: '~plugins/element-ui', ssr: true}
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/markdownit',
    '@nuxtjs/sitemap',
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
      'markdown-it-highlightjs',
    ]
  },

  sitemap: {
    hostname: configService.getSiteConfig().siteUrl,
    path: '/sitemap.xml',
    gzip: true,
    generate: true, // Enable me when using nuxt generate
    exclude: [],
    routes(callback) {
      const files = fileService.listFileByPath('')
      let routes = files.map(file => file.url)
      callback(null, routes)
    }
  },

  generate: {
    fallback: true,
    routes: fileService.listRoutes(),
  },
}

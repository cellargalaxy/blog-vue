import log from '../utils/log'
import configDao from '../dao/configDao'

const logger = log('configService')

function getConfig() {
  try {
    let config = configDao.getConfig()
    if (config == null) {
      logger.error('读取配置文件失败')
      config = {}
    }
    return config
  } catch (e) {
    logger.error('读取配置文件失败: {}', e)
    return {}
  }
}

function getGitConfig() {
  const config = getConfig()
  if (config.gitConfig) {
    return config.gitConfig
  }
  return {
    "extension": ".md",
    "dateRegular": "/\\d{4}-\\d{2}-\\d{2}/"
  }
}

function getSiteConfig() {
  const config = getConfig()
  if (config.siteConfig) {
    return config.siteConfig
  }
  return {
    "siteUrl": "http://127.0.0.1:3000",
    "siteName": "主页の名",
    "faviconUrl": "https://i.loli.net/2019/07/09/5d2484e68fddd81209.jpg",
    "description": "主页の名",
    "backgroundImage": {
      "duration": 6000,
      "fade": 1000,
      "images": [
        {
          "description": "来自深渊-娜娜奇",
          "clientType": "pc",
          "url": "https://i.loli.net/2020/01/20/VXvo2ShyBaPNkdJ.jpg"
        },
        {
          "description": "宝石之国-钻石",
          "clientType": "phone",
          "url": "https://i.loli.net/2020/01/22/GIZMQjfxEWwgsXt.jpg"
        }
      ]
    },
    "staticCssUrl": "/static.css",
    "staticJsUrl": "/static.js"
  }
}

function getHomeConfig() {
  const config = getConfig()
  if (config.homeConfig) {
    return config.homeConfig
  }
  return {
    "brandInterval": 5000,
    "brands": [
      {
        "imageUrl": "https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png",
        "title": "这是大招牌-1",
        "texts": ["这是一段招牌的演示文字-1-1", "这是一段招牌的演示文字-1-2"]
      },
      {
        "imageUrl": "https://i.loli.net/2018/04/10/5accdcbcb1738.jpg",
        "title": "这是大招牌-2",
        "texts": ["这是一段招牌的演示文字-2-1", "这是一段招牌的演示文字-2-2"]
      },
      {
        "imageUrl": "https://i.loli.net/2018/08/21/5b7bbc8ec3633.jpg",
        "title": "这是大招牌-3",
        "texts": ["这是一段招牌的演示文字-3-1", "这是一段招牌的演示文字-3-2"]
      }
    ],
    "navs": [
      {"text": "twitter", "url": "https://twitter.com/"},
      {"text": "facebook", "url": "https://facebook.com/"},
      {"text": "微博", "url": "https://weibo.com/"},
      {"text": "知乎", "url": "https://www.zhihu.com/"}
    ]
  }
}

function getNavbarConfig() {
  const config = getConfig()
  if (config.navbarConfig) {
    return config.navbarConfig
  }
  return {
    "brandText": "主页の名",
    "brandUrl": "/",
    "navs": [
      {"text": "文章", "url": "/page/1/"},
      {"text": "时间轴", "url": "/timeLine/"},
      {"text": "关于我", "url": "/article/README/"},
      {"text": "开源", "url": "https://github.com/cellargalaxy/blog-vue"}
    ]
  }
}

function getArticleConfig() {
  const config = getConfig()
  if (config.articleConfig) {
    return config.articleConfig
  }
  return {
    "summaryLength": 5,
    "pageSize": 10,
    "dateFormat": "yyyy-MM-dd"
  }
}

function getPageFootConfig() {
  const config = getConfig()
  if (config.pageFootConfig) {
    return config.pageFootConfig
  }
  return [
    [
      {"text": "Copyright © 2017-? ."},
      {"text": "备案？不存在的"},
      {"text": "Powered by Nuxt.js & Github", "url": "https://github.com/"}
    ],
    [
      {"text": "友链："},
      {"text": "Github", "url": "https://github.com/"},
      {"text": "Nuxt.js", "url": "https://zh.nuxtjs.org"}
    ]
  ]
}

function getErrorPageConfig(statusCode) {
  statusCode = statusCode + ''
  let config = getConfig()
  if (config.errorPageConfig && config.errorPageConfig[statusCode]) {
    return config.errorPageConfig[statusCode]
  }
  return {
    "statusCode": statusCode,
    "message": "unknown error",
    "returnText": "go back home page",
    "returnUrl": "/"
  }
}

export default {
  getSiteConfig: getSiteConfig,
  getNavbarConfig: getNavbarConfig,
  getPageFootConfig: getPageFootConfig,
  getArticleConfig: getArticleConfig,
  getHomeConfig: getHomeConfig,
  getGitConfig: getGitConfig,
  getErrorPageConfig: getErrorPageConfig,
}

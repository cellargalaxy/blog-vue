import configDao from '../dao/configDao'

function getPageFootConfig() {
  const config = configDao.getConfig()
  if (config && config.pageFootConfig) {
    return config.pageFootConfig
  }
  return [
    [
      {
        "text": "Copyright © 2017-? cellargalaxy."
      },
      {
        "text": "备案？不存在的"
      },
      {
        "text": "Powered by Nuxt.js & Github",
        "url": "https://github.com/"
      }
    ],
    [
      {
        "text": "孤独的友链："
      },
      {
        "text": "さくら荘の白猫",
        "url": "https://2heng.xin"
      },
      {
        "text": "nuxtjs",
        "url": "https://zh.nuxtjs.org"
      }
    ]
  ]
}

function getGotoConfig() {
  const config = configDao.getConfig()
  if (config && config.gotoConfig) {
    return config.gotoConfig
  }
  return {
    "gotoTopText": "↑",
    "gotoBottomText": "↓",
    "contents": [
      {
        "text": "电报",
        "url": "https://t.me/"
      }
    ]
  }
}

function getPageHeadConfig() {
  const config = configDao.getConfig()
  if (config && config.pageHeadConfig) {
    return config.pageHeadConfig
  }
  return {
    "avatarUrl": "https://avatars2.githubusercontent.com/u/26119390?s=60&v=4",
    "siteName": "cellargalaxyの博客",
    "siteUrl": "/"
  }
}

function getSiteConfig() {
  const config = configDao.getConfig()
  if (config && config.siteConfig) {
    return config.siteConfig
  }
  return {
    "siteName": "cellargalaxyの博客",
    "faviconUrl": "https://2heng.xin/favicon-32x32.png",
    "description": "cellargalaxyの博客",
    "globalCssUrl": "/css/global.css",
    "globalJsUrl": "/js/global.js"
  }
}

function getArticleConfig() {
  const config = configDao.getConfig()
  if (config && config.articleConfig) {
    return config.articleConfig
  }
  return {
    "summaryLength": 5,
    "pageSize": 10,
    "dateFormat": "yyyy-MM-dd"
  }
}

function getNavbarConfig() {
  const config = configDao.getConfig()
  if (config && config.navbarConfig) {
    return config.navbarConfig
  }
  return {
    "brandText": "cellargalaxyの博客",
    "brandUrl": "/",
    "navs": [
      {
        "text": "文章",
        "url": "/articleList/1"
      },
      {
        "text": "时间轴",
        "url": "/timeLine"
      },
      {
        "text": "关于我",
        "url": "/关于我"
      },
      {
        "text": "开源",
        "url": "https://github.com/cellargalaxy/blog-vue"
      }
    ]
  }
}

function getHomeConfig() {
  const config = configDao.getConfig()
  if (config && config.homeConfig) {
    return config.homeConfig
  }
  return {
    "brandHello": "HI,MOSHIRO!",
    "brandTexts": [
      "我在这里的时候经常想，以前的人为什么总是留下记录呢？",
      "因为他们不想让有些事情发生改变。——苍之萤"
    ],
    "navs": [
      {
        "text": "推特",
        "url": "https://twitter.com/"
      },
      {
        "text": "电报",
        "url": "https://t.me/"
      },
      {
        "text": "github",
        "url": "https://github.com/"
      },
      {
        "text": "纸糊",
        "url": "https://www.zhihu.com/"
      }
    ]
  }
}

function getGitConfig() {
  const config = configDao.getConfig()
  if (config && config.gitConfig) {
    return config.gitConfig
  }
  return {
    "gitUrl": "https://github.com/cellargalaxy/blog.git",
    "ref": "master",
    "basePath": "",
    "repositoryMainPath": "repository",
    "pullTime": 1000 * 60 * 10,
    "extension": ".md",
    "dateRegular": "/\\d{4}-\\d{2}\\/\\d{2}/"
  }
}

export default {
  getPageFootConfig: getPageFootConfig,
  getGotoConfig: getGotoConfig,
  getPageHeadConfig: getPageHeadConfig,
  getSiteConfig: getSiteConfig,
  getArticleConfig: getArticleConfig,
  getNavbarConfig: getNavbarConfig,
  getHomeConfig: getHomeConfig,
  getGitConfig: getGitConfig,
}

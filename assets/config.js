function getPageFootConfig() {
  return [
    [
      {text: 'Copyright © 2017-2019 cellargalaxy.'},
      {text: '备案？不存在的'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
    ],
    [
      {text: '友链：'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
    ],
    [
      {text: '赞助：'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
      {text: 'Powered by Nuxt.js & Github', url: 'https://github.com/cellargalaxy'},
    ],
  ]
}

function getGotoConfig() {
  return {
    gotoTopText: '↑',
    gotoBottomText: '↓',
    contents: [
      {text: 'github', url: 'https://github.com/cellargalaxy'},
      {text: '邮箱', url: 'mailto:cellargalaxy@gmail.com'},
    ]
  }
}

function getPageHeadConfig() {
  return {
    avatarUrl: 'https://avatars2.githubusercontent.com/u/26119390?s=60&v=4',
    siteName: '',
    siteUrl: '/',
  }
}

function getSiteConfig() {
  return {
    siteName: 'cellargalaxyの',
    faviconUrl: 'https://2heng.xin/favicon-32x32.png',
    description: 'cellargalaxyの',
    globalCssUrl: '/css/global.css',
    globalJsUrl: '/js/global.js',
  }
}

function getArticleConfig() {
  return {
    summaryLength: 5,
    pageSize: 10,
    dateFormat: 'yyyy-MM-dd',
    otherArticleName: '其他',
  }
}

function getBackgroundImageUrls() {
  return [
    'https://i.loli.net/2018/10/02/5bb391d063618.jpg',
    'https://i.loli.net/2018/08/21/5b7bb5dd4f0df.png',
    'https://i.loli.net/2018/08/21/5b7bbc8ec3633.jpg',
    'https://i.loli.net/2018/04/10/5accdcbcb1738.jpg',
  ]
}

function getNavbarConfig() {
  return {
    brandText: 'cellargalaxyの',
    brandUrl: '/',
    navs: [
      {text: '文章', url: '/a'},
      {text: '时间轴', url: '/t'},
      {text: '关于我', url: '/ab'},
      {text: '开源', url: '/g'},
    ],
  }
}

function getHomeConfig() {
  return {
    brandHello: 'HI,MOSHIRO!',
    brandTexts: ['我在这里的时候经常想，以前的人为什么总是留下记录呢？', '因为他们不想让有些事情发生改变。——苍之萤'],
    navs: [
      {text: '微信', url: '/a'},
      {text: 'QQ', url: '/t'},
      {text: 'github', url: '/ab'},
      {text: '纸糊', url: '/g'},
    ],
  }
}

function getLogConfig() {
  return {
    name: 'default',
    level: 'debug',
  }
}

function getGitConfig() {
  return {
    gitUrl: 'https://github.com/cellargalaxy/blog.git',
    ref: 'master',
    basePath: '',
    repositoryMainPath: './repository',
    repositoryTmpPath: './repository-tmp',
    pullTime: 1000 * 60 * 1,
    extension: '.md',
    dateRegular: /\d{4}-\d{2}\/\d{2}/,
  }
}

export default {
  getPageFootConfig: getPageFootConfig,
  getGotoConfig: getGotoConfig,
  getPageHeadConfig: getPageHeadConfig,
  getSiteConfig: getSiteConfig,
  getArticleConfig: getArticleConfig,
  getBackgroundImageUrls: getBackgroundImageUrls,
  getNavbarConfig: getNavbarConfig,
  getHomeConfig: getHomeConfig,
  getLogConfig: getLogConfig,
  getGitConfig: getGitConfig,
}

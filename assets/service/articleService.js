const path = require('path')

import configService from "./configService"
import utils from "../utils/utils"
import log from "../utils/log"
import articleDao from '../dao/articleDao'

const pullTime = configService.getGitConfig().pullTime
log.info('文章缓存时间: {}', pullTime)

const repositoryMainPath = configService.getGitConfig().repositoryMainPath
const basePath = configService.getGitConfig().basePath
const repositoryPath = path.join(repositoryMainPath, basePath)
log.info('主仓库路径: {}', repositoryMainPath)
log.info('仓库基础路径: {}', basePath)
log.info('主仓库完整路径: {}, 即: {}', repositoryMainPath, path.join(path.resolve(), repositoryPath))

const extension = configService.getGitConfig().extension
const extensionRegularObject = new RegExp(extension)
log.info('文件扩展名正则: {}', extensionRegularObject)

//[{'article key': 'article value'}]
//需要按时间排序
let articles = []

//{'articlePath': {'article key': 'article value'}}
let pathArticleMap = {}

//[{'date': 'date', 'dateString': 'dateString', 'articles': [{'article key': 'article value'}]}]
//需要按时间排序
let timeLineArticles = []

function flushArticle() {
  log.info('开始刷新文章')
  const ass = articleDao.listArticle()

  //用于保存数据的临时对象
  const pam = {}
  //{'dateString': [{'article key': 'article value'}]}
  let tlas = {}
  //{'articlePath': [{'article key': 'article value'}]}
  let otherTlas = {}
  for (let i in ass) {
    const article = ass[i]

    pam[article.path.replace(repositoryPath, '').replace(extension, '')] = article

    if (article.date) {
      //有时间的文章
      const dateString = utils.formatDate(article.date, 'yyyy-MM')
      let timeArticles = tlas[dateString]
      if (!timeArticles) {
        timeArticles = []
      }
      timeArticles.push(article)
      tlas[dateString] = timeArticles
    } else {
      //没时间的文章用路径代替
      let articlePath = path.dirname(article.path.replace(repositoryPath, ''))
      let timeArticles = otherTlas[articlePath]
      if (!timeArticles) {
        timeArticles = []
      }
      timeArticles.push(article)
      otherTlas[articlePath] = timeArticles
    }
  }

  //对文章按时间排序
  ass.sort((article1, article2) => {
    if (!article1.date && !article2.date) {
      return 0
    }
    //没有时间的排在最后
    if (!article1.date) {
      return 1
    }
    if (!article2.date) {
      return -1
    }
    return article2.date.getTime() - article1.date.getTime()
  })

  //上面为了方便，tlam的数据结构并没有按照timeLineArticleMap，所以这里进行转换
  const tmp = tlas
  tlas = []
  for (let dateString in tmp) {
    //某个月的文章
    const articles = tmp[dateString]
    //对那个月的文章进行排序
    articles.sort((article1, article2) => {
      if (!article1.date && !article2.date) {
        return 0
      }
      //没有时间的排在最后
      if (!article1.date) {
        return 1
      }
      if (!article2.date) {
        return -1
      }
      return article2.date.getTime() - article1.date.getTime()
    })
    tlas.push({date: new Date(dateString), dateString: dateString, articles: articles})
  }
  //对时间线的全部月份进行排序
  tlas.sort((timeline1, timeline2) => {
    return timeline2.date.getTime() - timeline1.date.getTime()
  })
  for (let articlePath in otherTlas) {
    const articles = otherTlas[articlePath]
    tlas.push({dateString: articlePath, articles: articles})
  }

  articles = ass
  pathArticleMap = pam
  timeLineArticles = tlas
  // console.log('timeLineArticles')
  // console.log(timeLineArticles)
  // console.log('timeLineArticles')
}

function autoFlushArticle() {
  try {
    flushArticle()
  } catch (e) {
    log.error('自动刷新文章发生异常: {}', e)
  } finally {
    log.info('setTimeout调用autoFlushArticle')
    setTimeout(autoFlushArticle, pullTime)
  }
}

function listArticle() {
  if (articles.length == 0) {
    flushArticle()
  }
  if (!articles) {
    return []
  }
  return articles
}

function listArticlePage(pageSize, currentPage) {
  const articles = listArticle()
  const skipNum = (currentPage - 1) * pageSize;
  const articlePage = (skipNum + pageSize >= articles.length) ? articles.slice(skipNum, articles.length) : articles.slice(skipNum, skipNum + pageSize);
  return articlePage;
}

function getArticle(articlePath) {
  articlePath = path.join(repositoryPath, articlePath + extension)
  const article = articleDao.getArticle(articlePath)
  if (article) {
    return article
  }
  return null
}

function getTimeLineArticles() {
  if (articles.length == 0) {
    flushArticle()
  }
  if (!timeLineArticles) {
    return []
  }
  return timeLineArticles
}

export default {
  autoFlushArticle: autoFlushArticle,
  listArticle: listArticle,
  listArticlePage: listArticlePage,
  getArticle: getArticle,
  getTimeLineArticles: getTimeLineArticles,
}
import path from 'path'
import LRU from 'lru-cache'

import fileIO from '../utils/fileIO'
import log from '../utils/log'
import utils from '../utils/utils'
import articleDao from '../dao/articleDao'
import configService from './configService'

const articleKey = 'article-'
const articlesKey = 'articles'
const pathArticlesKey = 'pathArticles-'
const timeLineArticlesKey = 'timeLineArticles'
const lru = new LRU({
  max: 10000,
  maxAge: configService.getGitConfig().pullTime ? configService.getGitConfig().pullTime : 1000 * 60
})


const repositoryPath = configService.getGitConfig().repositoryPath
log.info('仓库路径: {}', repositoryPath)
const basePath = configService.getGitConfig().basePath
log.info('仓库基础路径: {}', basePath)
const repositoryBasePath = fileIO.join(repositoryPath, basePath)
log.info('仓库完整基础路径: {}, 即: {}', repositoryBasePath, fileIO.join(path.resolve(), repositoryBasePath))

const pullTime = configService.getGitConfig().pullTime
log.info('文章缓存时间: {}', pullTime)

const extension = configService.getGitConfig().extension
const extensionRegularObject = new RegExp(extension)
log.info('文件扩展名正则: {}', extensionRegularObject)


function articles2timeLineArticles(articles) {
  //用于保存数据的临时对象
  //{'dateString': [{'article key': 'article value'}]}
  let timeLineArticles = {}
  //{'articlePath': [{'article key': 'article value'}]}
  let otherTimeLineArticles = {}
  for (let i in articles) {
    const article = articles[i]

    if (article.date) {
      //有时间的文章
      const dateString = utils.formatDate(article.date, 'yyyy-MM')
      let timeArticles = timeLineArticles[dateString]
      if (!timeArticles) {
        timeArticles = []
      }
      timeArticles.push(article)
      timeLineArticles[dateString] = timeArticles
    } else {
      //没时间的文章用路径代替
      let articlePath = path.dirname(article.path.replace(repositoryBasePath, ''))
      let timeArticles = otherTimeLineArticles[articlePath]
      if (!timeArticles) {
        timeArticles = []
      }
      timeArticles.push(article)
      otherTimeLineArticles[articlePath] = timeArticles
    }
  }

  //上面为了方便，timeLineArticles的数据结构并没有按照timeLineArticleMap，所以这里进行转换
  const tmp = timeLineArticles
  timeLineArticles = []
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
    timeLineArticles.push({date: new Date(dateString), dateString: dateString, articles: articles})
  }
  //对时间线的全部月份进行排序
  timeLineArticles.sort((timeline1, timeline2) => {
    return timeline2.date.getTime() - timeline1.date.getTime()
  })
  //如果可以，对otherTimeLineArticles也进行一下排序
  for (let articlePath in otherTimeLineArticles) {
    const articles = otherTimeLineArticles[articlePath]
    timeLineArticles.push({dateString: articlePath, articles: articles})
  }

  return timeLineArticles
}

function getArticle(articlePath) {
  if (lru.has(articleKey + articlePath)) {
    return lru.get(articleKey + articlePath)
  }
  const article = articleDao.getArticle(articlePath)
  if (article) {
    lru.set(articleKey + articlePath, article)
    return article
  }
  return null
}

function listArticleByPath(folderPath) {
  if (lru.has(pathArticlesKey + folderPath)) {
    return lru.get(pathArticlesKey + folderPath)
  }
  const articles = articleDao.listArticleByPath(folderPath)
  if (articles) {
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
    lru.set(pathArticlesKey + folderPath, articles)
    return articles
  }
  return []
}

function listArticlePageByPath(folderPath, pageSize, currentPage) {
  const articles = listArticleByPath(folderPath)
  const skipNum = (currentPage - 1) * pageSize;
  const articlePage = (skipNum + pageSize >= articles.length) ? articles.slice(skipNum, articles.length) : articles.slice(skipNum, skipNum + pageSize);
  return articlePage;
}

function listArticle() {
  if (lru.has(articlesKey)) {
    return lru.get(articlesKey)
  }
  const articles = articleDao.listArticle()
  if (articles) {
    //对文章按时间排序
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
    lru.set(articlesKey, articles)
    return articles
  }
  return []
}

function listArticlePage(pageSize, currentPage) {
  const articles = listArticle()
  const skipNum = (currentPage - 1) * pageSize;
  const articlePage = (skipNum + pageSize >= articles.length) ? articles.slice(skipNum, articles.length) : articles.slice(skipNum, skipNum + pageSize);
  return articlePage;
}

function getTimeLineArticles() {
  //[{'date': 'date', 'dateString': 'dateString', 'articles': [{'article key': 'article value'}]}]
  //需要按时间排序
  if (lru.has(timeLineArticlesKey)) {
    return lru.get(timeLineArticlesKey)
  }
  const timeLineArticles = articles2timeLineArticles(listArticle())
  lru.set(timeLineArticlesKey, timeLineArticles)
  return timeLineArticles
}

export default {
  listArticle: listArticle,
  listArticlePage: listArticlePage,
  getArticle: getArticle,
  getTimeLineArticles: getTimeLineArticles,
  listArticleByPath: listArticleByPath,
  listArticlePageByPath: listArticlePageByPath,
}
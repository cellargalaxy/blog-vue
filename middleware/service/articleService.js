import utils from '../utils/utils'
import articleDao from '../dao/articleDao'
import fileIO from "../utils/fileIO"
import configService from './configService'
import log from "../utils/log"

const logger = log('articleService')

const pageSize = configService.getArticleConfig().pageSize

function getArticle(articlePath) {
  try {
    return articleDao.getArticle(articlePath)
  } catch (e) {
    logger.error('读取文章文件失败: {}', e)
  }
}

function listArticleByPath(folderPath) {
  let articles = null
  try {
    articles = articleDao.listArticleByPath(folderPath)
  } catch (e) {
    logger.error('读取文章列表文件失败: {}', e)
  }
  if (!articles) {
    articles = []
  }
  articles.sort(sortArticles)
  return articles
}

function listArticlePageByPath(folderPath, currentPage) {
  const articles = listArticleByPath(folderPath)
  const skipNum = (currentPage - 1) * pageSize
  const articlePage = (skipNum + pageSize >= articles.length) ? articles.slice(skipNum, articles.length) : articles.slice(skipNum, skipNum + pageSize)
  return {folderPath: folderPath, articles: articles, currentPage: currentPage, articlePage: articlePage}
}

function listAllArticle() {
  let articles = null
  try {
    articles = articleDao.listAllArticle()
  } catch (e) {
    logger.error('读取全部文章列表文件失败: {}', e)
  }
  if (!articles) {
    articles = []
  }
  articles.sort(sortArticles)
  return articles
}

function listAllArticlePage(currentPage) {
  const articles = listAllArticle()
  const skipNum = (currentPage - 1) * pageSize
  const articlePage = (skipNum + pageSize >= articles.length) ? articles.slice(skipNum, articles.length) : articles.slice(skipNum, skipNum + pageSize)
  return {articles: articles, currentPage: currentPage, articlePage: articlePage}
}

function getTimeLineArticles() {
  //[{'date': 'date', 'dateString': 'dateString', 'articles': [{'article key': 'article value'}]}]
  return articles2timeLineArticles(listAllArticle())
}

function articles2timeLineArticles(articles) {
  //用于保存数据的临时对象
  //{'dateString': [{'article key': 'article value'}]}
  let timeLineArticles = {}
  //{'sort': [{'article key': 'article value'}]}
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
      //没时间的文章用分类代替
      let sort = article.sort
      let timeArticles = otherTimeLineArticles[sort]
      if (!timeArticles) {
        timeArticles = []
      }
      timeArticles.push(article)
      otherTimeLineArticles[sort] = timeArticles
    }
  }

  //上面为了方便，timeLineArticles的数据结构并没有按照timeLineArticleMap，所以这里进行转换
  let tmp = timeLineArticles
  timeLineArticles = []
  for (let dateString in tmp) {
    //某个月的文章
    const articles = tmp[dateString]
    //对那个月的文章进行排序
    articles.sort(sortArticles)
    timeLineArticles.push({date: new Date(dateString), dateString: dateString, articles: articles})
  }
  //对时间线的全部月份进行排序
  timeLineArticles.sort((timeline1, timeline2) => {
    return timeline2.date.getTime() - timeline1.date.getTime()
  })

  tmp = otherTimeLineArticles
  otherTimeLineArticles = []
  for (let sort in tmp) {
    const articles = tmp[sort]
    otherTimeLineArticles.push({dateString: sort, articles: articles})
  }
  otherTimeLineArticles.sort((timeline1, timeline2) => {
    return timeline1.dateString.localeCompare(timeline2.dateString)
  })

  //将没有时间的文章放到timeLineArticles里
  for (let sort in otherTimeLineArticles) {
    timeLineArticles.push(otherTimeLineArticles[sort])
  }

  return timeLineArticles
}

function sortArticles(article1, article2) {
  if (!article1.date && !article2.date) {
    return article1.title.localeCompare(article2.title)
  }
  //没有时间的排在最后
  if (!article1.date) {
    return 1
  }
  if (!article2.date) {
    return -1
  }
  return article2.date.getTime() - article1.date.getTime()
}

function listRoutes() {
  let articles = null
  try {
    articles = articleDao.listAllArticle()
  } catch (e) {
    logger.error('读取全部文章列表文件失败: {}', e)
  }
  if (!articles) {
    articles = []
  }
  const routes = []
  const sorts = {}
  for (let i in articles) {
    const article = articles[i]
    routes.push(article.url)

    let sum = sorts[article.sort]
    if (!sum) {
      sum = 0
    }
    sum++
    sorts[article.sort] = sum
  }
  let pageSize = configService.getArticleConfig().pageSize
  if (!pageSize) {
    pageSize = 10
  }
  sorts['/'] = articles.length
  for (let sort in sorts) {
    let sum = sorts[sort] / pageSize
    if (sorts[sort] % pageSize > 0) {
      sum++
    }
    for (let page = 1; page <= sum; page++) {
      routes.push('/' + fileIO.join('page', sort, page.toString()) + '/')
    }
  }
  return routes
}

export default {
  getArticle: getArticle,
  listArticleByPath: listArticleByPath,
  listArticlePageByPath: listArticlePageByPath,
  listAllArticle: listAllArticle,
  listAllArticlePage: listAllArticlePage,
  getTimeLineArticles: getTimeLineArticles,
  listRoutes: listRoutes,
}
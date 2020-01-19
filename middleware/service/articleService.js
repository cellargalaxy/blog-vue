import path from 'path'

import log from '../utils/log'
import utils from '../utils/utils'
import fileIO from '../utils/fileIO'
import articleDao from '../dao/articleDao'
import configService from './configService'

const logger = log('articleService')

const DATE_REGULAR = configService.getGitConfig().dateRegular
const DATE_REGULAR_OBJECT = new RegExp(DATE_REGULAR)
const EXTENSION = configService.getGitConfig().extension

const PAGE_SIZE = configService.getArticleConfig().pageSize
const DATE_FORMAT = configService.getArticleConfig().dateFormat
const SUMMARY_LENGTH = configService.getArticleConfig().summaryLength

function getArticle(articleUrlPath) {
  try {
    let articlePath = articleUrlPath
    if (utils.endsWith(articlePath, '/')) { //-> a/b/c/
      articlePath = articlePath.substring(0, articlePath.length - 1) //-> a/b/c
    }
    articlePath = articlePath + EXTENSION //-> a/b/c.md
    logger.info('添加拓展名articlePath: {}', articlePath)
    const markdown = articleDao.getMarkdown(articlePath)
    const article = createArticle(articlePath, markdown)
    return article
  } catch (e) {
    logger.error('读取文章文件失败: {}', e)
    return null
  }
}

function listArticleByPath(folderUrlPath) {
  try {
    const fileMarkdown = articleDao.listFileMarkdown(folderUrlPath, DATE_REGULAR_OBJECT, EXTENSION)
    const articles = []
    for (const articlePath in fileMarkdown) {
      articles.push(createArticle(articlePath, fileMarkdown[articlePath]))
    }
    articles.sort(sortArticles)
    return articles
  } catch (e) {
    logger.error('读取文章列表文件失败: {}', e)
    return null
  }
}

function listArticlePageByPath(folderPath, currentPage) {
  const articles = listArticleByPath(folderPath)
  const skipNum = (currentPage - 1) * PAGE_SIZE
  const articlePage = (skipNum + PAGE_SIZE >= articles.length) ? articles.slice(skipNum, articles.length) : articles.slice(skipNum, skipNum + PAGE_SIZE)
  return {folderPath: folderPath, articles: articles, currentPage: currentPage, articlePage: articlePage}
}

/**
 * [{"date":"date","dateString":"dateString","articles":[{"article_key":"article_value"}]}]
 */
function getTimeLineArticles() {
  const articles = listArticleByPath('')

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

function listRoutes() {
  const articles = listArticleByPath('')
  if (articles == null) {
    return null
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
  sorts['/'] = articles.length
  for (let sort in sorts) {
    let sum = sorts[sort] / PAGE_SIZE
    if (sorts[sort] % PAGE_SIZE > 0) {
      sum++
    }
    for (let page = 1; page <= sum; page++) {
      routes.push(fileIO.join('/page', sort, page.toString(), '/'))
    }
  }
  return routes
}

//----------------------------------------------------------------------------------------------------------------------

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

function createArticle(articlePath, markdown) {
  const article = {}
  article.path = articlePath
  article.markdown = markdown

  let summary = ''
  const markdowns = markdown.split('\n')
  let count = 0
  for (let i = 0; i < markdowns.length && count < SUMMARY_LENGTH; i++) {
    if (markdowns[i] && (markdowns[i] = markdowns[i].trim()).length > 0) {
      summary = summary + markdowns[i] + '\n'
      count = count + 1
    }
  }
  article.summary = summary

  article.title = path.basename(articlePath).split(EXTENSION)[0]
  article.url = fileIO.join('/article', articlePath.replace(EXTENSION, ''), '/')

  const attributes = []

  let dateExec = DATE_REGULAR_OBJECT.exec(articlePath)
  if (dateExec) {
    let dateString = dateExec.toString()
    const date = new Date(dateString)
    dateString = utils.formatDate(date, DATE_FORMAT)
    article.date = date
    article.dateString = dateString
    attributes.push({"name": "时间", "value": dateString})
  }

  let sort = articlePath.split(article.title)[0]
  if (dateExec) {
    let dateString = dateExec.toString()
    sort = sort.split(dateString)[0]
  }
  if (sort == null || sort == '') {
    sort = '/'
  }
  const sortUrl = fileIO.join('/page', sort, '1/')
  article.sort = sort
  article.sortUrl = sortUrl
  attributes.push({"name": "分类", "value": sort, "url": sortUrl})

  const wordSum = article.markdown.length
  article.wordSum = wordSum
  attributes.push({"name": "字数", "value": wordSum})

  //https://www.wukong.com/question/6434284981916270849/
  let readTime = Math.round(wordSum / 300)
  if (readTime == 0) {
    readTime = 1
  }
  article.readTime = readTime
  attributes.push({"name": "阅读时间", "value": readTime + 'minute'})

  article.attributes = attributes
  return article
}

export default {
  getArticle: getArticle,
  listArticleByPath: listArticleByPath,
  listArticlePageByPath: listArticlePageByPath,
  getTimeLineArticles: getTimeLineArticles,
  listRoutes: listRoutes,
}
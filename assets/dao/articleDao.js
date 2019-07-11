const path = require('path')
const fs = require('fs')

import utils from "../utils/utils";
import log from '../utils/log'
import configService from '../service/configService'

const repositoryPath = configService.getGitConfig().repositoryPath
const basePath = configService.getGitConfig().basePath
const repositoryBasePath = path.join(repositoryPath, basePath)
log.info('仓库路径: {}', repositoryPath)
log.info('仓库基础路径: {}', basePath)
log.info('仓库完整基础路径: {}, 即: {}', repositoryBasePath, path.join(path.resolve(), repositoryBasePath))

const extension = configService.getGitConfig().extension
const extensionRegularObject = new RegExp(extension)
log.info('文件扩展名正则: {}', extensionRegularObject)

const dateRegular = configService.getGitConfig().dateRegular
const dateRegularObject = new RegExp(dateRegular)
log.info('文件日期正则: {}', dateRegularObject)

const summaryLength = configService.getArticleConfig().summaryLength
log.info('摘要长度: {}', summaryLength)

function getArticle(articlePath) {
  if (!articlePath || !fs.existsSync(articlePath)) {
    return null
  }
  const stats = fs.statSync(articlePath)
  if (stats.isFile() && extensionRegularObject.test(articlePath)) {
    const data = fs.readFileSync(articlePath)
    const markdown = data.toString()
    return fileMarkdown2Article(articlePath, markdown, repositoryBasePath, dateRegularObject, extension, summaryLength)
  }
  return null
}

function listArticle() {
  //{'articlePath': 'markdown'}
  let fileMarkdown = {}
  getFileMarkdownFromFolder(repositoryBasePath, fileMarkdown, extensionRegularObject)

  const articles = []
  for (let articlePath in fileMarkdown) {
    const article = fileMarkdown2Article(articlePath, fileMarkdown[articlePath], repositoryBasePath, dateRegularObject, extension, summaryLength)
    articles.push(article)
  }
  return articles
}

function getFileMarkdownFromFolder(articlePath, fileMarkdown, extensionRegularObject) {
  if (!articlePath || !fs.existsSync(articlePath)) {
    log.debug('路径不存在: {}', articlePath)
    return
  }
  const stats = fs.statSync(articlePath)
  if (stats.isFile() && extensionRegularObject.test(articlePath)) {
    const data = fs.readFileSync(articlePath)
    const markdown = data.toString()
    fileMarkdown[articlePath.replace(/\\/g, '/')] = markdown
    return
  }
  if (stats.isDirectory()) {
    const files = fs.readdirSync(articlePath)
    for (let i = 0; i < files.length; i++) {
      if (!files[i].startsWith('.')) {
        getFileMarkdownFromFolder(path.join(articlePath, files[i]), fileMarkdown, extensionRegularObject)
      }
    }
  }
}

function fileMarkdown2Article(articlePath, markdown, repositoryPath, dateRegularObject, extension, summaryLength) {
  const article = {}
  article.path = articlePath
  article.markdown = markdown
  let summary = ''
  const markdowns = markdown.split('\n')
  let count = 0
  for (let i = 0; i < markdowns.length && count < summaryLength; i++) {
    if (markdowns[i] && (markdowns[i] = markdowns[i].trim()).length > 0) {
      count = count + 1
    }
    summary = summary + markdowns[i] + '\n'
  }
  article.summary = summary
  const title = path.basename(articlePath)
  article.title = title.replace(extension, '')
  article.url = articlePath.replace(repositoryPath, '').replace(extension, '')

  const attributes = []

  let dateString = dateRegularObject.exec(articlePath)
  if (dateString) {
    dateString = dateString.toString()
    const date = new Date(dateString)
    dateString = utils.formatDate(date, configService.getArticleConfig().dateFormat)
    article.date = date
    article.dateString = dateString
    attributes.push({"name": "时间", "value": dateString})
  }

  const sort = articlePath.split(dateString)[0].replace(repositoryPath, '').replace('/', '')
  if (sort && sort != '') {
    article.sort = sort
  }

  const wordSum = article.markdown.length
  article.wordSum = wordSum
  attributes.push({"name": "字数", "value": wordSum})

  //https://www.wukong.com/question/6434284981916270849/
  let readTime = Math.round(wordSum / 300)
  if (readTime == 0) {
    readTime = 1
  }
  readTime = readTime + '分钟'
  article.readTime = readTime
  attributes.push({"name": "阅读时间", "value": readTime})

  article.attributes = attributes
  return article
}

export default {
  getArticle: getArticle,
  listArticle: listArticle,
}

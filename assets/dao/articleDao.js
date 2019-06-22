const path = require('path')
const fs = require('fs-extra')

import utils from "../utils/utils";
import log from '../utils/log'
import config from '../config'

const repositoryMainPath = config.getGitConfig().repositoryMainPath
const basePath = config.getGitConfig().basePath
const repositoryPath = path.join(repositoryMainPath, basePath)
log.info('主仓库路径: {}', repositoryMainPath)
log.info('仓库基础路径: {}', basePath)
log.info('主仓库基础路径: {}, 即: {}', repositoryPath, path.join(path.resolve(), repositoryPath))

const extension = config.getGitConfig().extension
const extensionRegularObject = new RegExp(extension)
log.info('文件扩展名正则: {}', extensionRegularObject)

const dateRegular = config.getGitConfig().dateRegular
const dateRegularObject = new RegExp(dateRegular)
log.info('文件日期正则: {}', dateRegularObject)

function getArticle(articlePath) {
  if (!articlePath || !fs.pathExistsSync(articlePath)) {
    return null
  }
  const stats = fs.statSync(articlePath)
  if (stats.isFile() && extensionRegularObject.test(articlePath)) {
    const data = fs.readFileSync(articlePath)
    const markdown = data.toString()
    return fileMarkdown2Article(articlePath, markdown, repositoryPath, dateRegularObject, extension)
  }
  return null
}

function listArticle() {
  //{'articlePath': 'markdown'}
  let fileMarkdown = {}
  getFileMarkdownFromFolder(repositoryPath, fileMarkdown, extensionRegularObject)

  const articles = []
  for (let articlePath in fileMarkdown) {
    const article = fileMarkdown2Article(articlePath, fileMarkdown[articlePath], repositoryPath, dateRegularObject, extension)
    articles.push(article)
  }

  return articles
}

function getFileMarkdownFromFolder(articlePath, fileMarkdown, extensionRegularObject) {
  if (!articlePath || !fs.pathExistsSync(articlePath)) {
    log.debug('路径不存在: {}', articlePath)
    return
  }
  const stats = fs.statSync(articlePath)
  if (stats.isFile() && extensionRegularObject.test(articlePath)) {
    const data = fs.readFileSync(articlePath)
    const markdown = data.toString()
    fileMarkdown[articlePath] = markdown
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

function fileMarkdown2Article(articlePath, markdown, repositoryPath, dateRegularObject, extension) {
  const article = {}
  article.path = articlePath
  article.markdown = markdown
  let strings = articlePath.split('/')
  let title = strings[strings.length - 1]
  article.title = title.replace(extension, '')
  article.url = articlePath.replace(repositoryPath, '').replace(extension, '')

  article.html = markdown
  article.summaryHtml = markdown

  const attributes = []

  let dateString = dateRegularObject.exec(articlePath)
  if (dateString) {
    dateString = dateString.toString()
    const date = new Date(dateString)
    dateString = utils.formatDate(date, config.getArticleConfig().dateFormat)
    article.date = date
    article.dateString = dateString
    attributes.push({"name": "时间", "value": dateString})
  }

  const wordSum = article.markdown.length
  article.wordSum = wordSum
  attributes.push({"name": "字数", "value": wordSum})

  //https://www.wukong.com/question/6434284981916270849/
  const readTime = Math.round(wordSum / 300) + '分钟'
  article.readTime = readTime
  attributes.push({"name": "阅读时间", "value": readTime})

  article.attributes = attributes
  return article
}

export default {
  getArticle: getArticle,
  listArticle: listArticle,
}
import path from 'path'
import fs from 'fs'

import fileIO from '../utils/fileIO'
import utils from '../utils/utils'
import configService from '../service/configService'
import config from '../config'

const repositoryPath = config.repositoryPath
const extension = configService.getGitConfig().extension
const dateRegular = configService.getGitConfig().dateRegular
const dateRegularObject = new RegExp(dateRegular)
const summaryLength = configService.getArticleConfig().summaryLength

function getArticle(articlePath) {
  articlePath = fileIO.join(repositoryPath, articlePath + extension)
  if (fileIO.isFile(articlePath)) {
    const data = fs.readFileSync(articlePath)
    const markdown = data.toString()
    return fileMarkdown2Article(articlePath, markdown)
  }
  return null
}

function listAllArticle() {
  return listArticleByPath('')
}

function listArticleByPath(folderPath) {
  //避免被人拼凑其他的路径
  folderPath = fileIO.join(repositoryPath, folderPath)
  //{'articlePath': 'markdown'}
  let fileMarkdown = {}
  getFileMarkdownFromFolder(folderPath, fileMarkdown)

  const articles = []
  for (let articlePath in fileMarkdown) {
    const article = fileMarkdown2Article(articlePath, fileMarkdown[articlePath])
    articles.push(article)
  }
  return articles
}

function getFileMarkdownFromFolder(articlePath, fileMarkdown) {
  if (fileIO.isFile(articlePath) && articlePath.endsWith(extension)) {
    const data = fs.readFileSync(articlePath)
    const markdown = data.toString()
    fileMarkdown[articlePath] = markdown
    return
  }
  if (fileIO.isFolder(articlePath)) {
    const files = fs.readdirSync(articlePath)
    for (let i = 0; i < files.length; i++) {
      if (!files[i].startsWith('.')) {
        getFileMarkdownFromFolder(fileIO.join(articlePath, files[i]), fileMarkdown)
      }
    }
  }
}

function fileMarkdown2Article(articlePath, markdown) {
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
  article.url = '/article' + articlePath.replace(repositoryPath, '').replace(extension, '')

  const attributes = []

  let dateExec = dateRegularObject.exec(articlePath)
  if (dateExec) {
    let dateString = dateExec.toString()
    const date = new Date(dateString)
    dateString = utils.formatDate(date, configService.getArticleConfig().dateFormat)
    article.date = date
    article.dateString = dateString
    attributes.push({"name": "时间", "value": dateString})
  }

  let sort = articlePath.replace(repositoryPath, '')
  if (dateExec) {
    let dateString = dateExec.toString()
    sort = sort.split(dateString)[0]
  }
  sort = sort.replace(path.basename(articlePath), '')
  if (sort && sort != '') {
    article.sort = sort
    article.sortUrl = '/' + fileIO.join('page', sort, '1') + '/'
    attributes.push({"name": "分类", "value": sort, "url": article.sortUrl})
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
  listAllArticle: listAllArticle,
  listArticleByPath: listArticleByPath,
}

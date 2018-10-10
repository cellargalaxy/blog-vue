import util from '../utils/util'
import account from '../utils/account'
import axios from '../utils/axios'
import adminArticleApi from './adminArticleApi'

function addArticle(article, tags) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认添加文章？', article, 'sortId', 'title', 'markdown')) {
    return adminArticleApi.addArticle(article.sortId, article.title, article.markdown, article.view, tags)
  }
  return axios.createEmptyResponse()
}

function removeArticle(article) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认删除文章？', article, 'articleId')) {
    return adminArticleApi.removeArticle(article.articleId)
  }
  return axios.createEmptyResponse()
}

function changeArticle(article) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认修改文章？', article, 'articleId')) {
    return adminArticleApi.changeArticle(article.articleId, article.userId, article.sortId, article.title, article.markdown, article.view)
  }
  return axios.createEmptyResponse()
}

function getArticle(article) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterOr(null, article, 'articleId', 'createDate', 'title')) {
    return adminArticleApi.getArticle(article.articleId, article.createDate, article.title)
  }
  return axios.createEmptyResponse()
}

function getArticleVo(article) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd(null, article, 'articleId')) {
    return adminArticleApi.getArticleVo(article.articleId)
  }
  return axios.createEmptyResponse()
}

export default {
  addArticle: addArticle,
  removeArticle: removeArticle,
  changeArticle: changeArticle,
  getArticle: getArticle,
  getArticleVo: getArticleVo,
}

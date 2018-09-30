import util from '../utils/util'
import axios from '../utils/axios'
import adminArticleApi from './adminArticleApi'

function addArticle(article, tags) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认添加文章？', article, 'userId', 'sortId', 'markdown')) {
    return adminArticleApi.addArticle(article.userId, article.sortId, article.title, article.markdown, article.view, tags)
  }
  return axios.createEmtryAxios()
}

function removeArticle(article) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认删除文章？', article, 'articleId')) {
    return adminArticleApi.removeArticle(article.articleId)
  }
  return axios.createEmtryAxios()
}

function changeArticle(article) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认修改文章？', article, 'articleId')) {
    return adminArticleApi.changeArticle(article.articleId, article.userId, article.sortId, article.title, article.markdown, article.view)
  }
  return axios.createEmtryAxios()
}

function getArticle(article) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  return adminArticleApi.getArticle(article.articleId)
}

function getArticleVo(article) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  return adminArticleApi.getArticleVo(article.articleId)
}

function createArticleQuery() {
  return {pageSize: 20, page: 1, articleId: 0, userId: 0, sortId: 0, title: null}
}

function listArticle(articleQuery) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkQueryParameter(articleQuery)) {
    return adminArticleApi.listArticle(articleQuery.pageSize, articleQuery.page, articleQuery.articleId, articleQuery.userId, articleQuery.sortId, articleQuery.title)
  }
  return axios.createEmtryAxios()
}

function listArticleVo(articleQuery) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkQueryParameter(articleQuery)) {
    return adminArticleApi.listArticleVo(articleQuery.pageSize, articleQuery.page, articleQuery.articleId, articleQuery.userId, articleQuery.sortId, articleQuery.title)
  }
  return axios.createEmtryAxios()
}

function getArticleCount(articleQuery) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkQueryParameter(articleQuery)) {
    return adminArticleApi.getArticleCount(articleQuery.pageSize, articleQuery.page, articleQuery.articleId, articleQuery.userId, articleQuery.sortId, articleQuery.title)
  }
  return axios.createEmtryAxios()
}

export default {
  addArticle: addArticle,
  removeArticle: removeArticle,
  changeArticle: changeArticle,
  getArticle: getArticle,
  getArticleVo: getArticleVo,
  createArticleQuery: createArticleQuery,
  listArticle: listArticle,
  listArticleVo: listArticleVo,
  getArticleCount: getArticleCount,
}

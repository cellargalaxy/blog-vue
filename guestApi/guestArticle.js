import guestArticleApi from './guestArticleApi'
import util from "../utils/util";
import axios from "../utils/axios";

function viewArticle(article) {
  if (util.checkParameterAnd(null, article, 'createDate', 'title')) {
    return guestArticleApi.viewArticle(article.createDate, article.title)
  }
  return axios.createEmptyResponse()
}

function viewArticleVo(article) {
  if (util.checkParameterAnd(null, article, 'createDate', 'title')) {
    return guestArticleApi.viewArticleVo(article.createDate, article.title)
  }
  return axios.createEmptyResponse()
}

function listArticleBySort(articleQuery) {
  if (util.checkQueryParameter(articleQuery, 'sort')) {
    return guestArticleApi.listArticleBySort(articleQuery.pageSize, articleQuery.page, articleQuery.sort)
  }
  return axios.createEmptyResponse()
}

function listArticleVoBySort(articleQuery) {
  if (util.checkQueryParameter(articleQuery, 'sort')) {
    return guestArticleApi.listArticleVoBySort(articleQuery.pageSize, articleQuery.page, articleQuery.sort)
  }
  return axios.createEmptyResponse()
}

function getArticleCountBySort(articleQuery) {
  if (util.checkQueryParameter(articleQuery, 'sort')) {
    return guestArticleApi.getArticleCountBySort(articleQuery.sort)
  }
  return axios.createEmptyResponse()
}

function listAllSitemap() {
  return guestArticleApi.listAllSitemap()
}

function createArticleQuery() {
  return {pageSize: 10, page: 1, sort: null}
}

export default {
  viewArticle: viewArticle,
  viewArticleVo: viewArticleVo,
  listArticleBySort: listArticleBySort,
  listArticleVoBySort: listArticleVoBySort,
  getArticleCountBySort: getArticleCountBySort,
  createArticleQuery: createArticleQuery,
  listAllSitemap: listAllSitemap,
}

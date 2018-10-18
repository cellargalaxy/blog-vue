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

function listAbleArticleBySort(articleQuery) {
  if (util.checkQueryParameter(articleQuery, 'sort')) {
    return guestArticleApi.listAbleArticleBySort(articleQuery.pageSize, articleQuery.page, articleQuery.sort)
  }
  return axios.createEmptyResponse()
}

function listAbleArticleVoBySort(articleQuery) {
  if (util.checkQueryParameter(articleQuery, 'sort')) {
    return guestArticleApi.listAbleArticleVoBySort(articleQuery.pageSize, articleQuery.page, articleQuery.sort)
  }
  return axios.createEmptyResponse()
}

function getArticleCountBySortAndStatus(articleQuery) {
  if (util.checkQueryParameter(articleQuery)) {
    return guestArticleApi.getArticleCountBySortAndStatus(articleQuery.sort, articleQuery.status)
  }
  return axios.createEmptyResponse()
}

function listAllSitemap() {
  return guestArticleApi.listAllSitemap()
}

function createArticleQuery() {
  return {pageSize: 10, page: 1, sort: null, status: 0}
}

export default {
  viewArticle: viewArticle,
  viewArticleVo: viewArticleVo,
  listAbleArticleBySort: listAbleArticleBySort,
  listAbleArticleVoBySort: listAbleArticleVoBySort,
  getArticleCountBySortAndStatus: getArticleCountBySortAndStatus,
  listAllSitemap: listAllSitemap,
  createArticleQuery: createArticleQuery,
}

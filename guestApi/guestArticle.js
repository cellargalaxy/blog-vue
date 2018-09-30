import guestArticleApi from './guestArticleApi'
import util from "../utils/util";
import axios from "../utils/axios";

function viewArticle(article) {
  return guestArticleApi.viewArticle(article.articleId)
}

function createArticleQuery() {
  return {pageSize: 20, page: 1, articleId: 0, userId: 0, sortId: 0, title: null}
}

function listArticleVo(articleQuery) {
  if (util.checkQueryParameter(articleQuery)) {
    return guestArticleApi.listArticleVo(articleQuery.pageSize, articleQuery.page, articleQuery.articleId, articleQuery.userId, articleQuery.sortId, articleQuery.sort, articleQuery.title)
  }
  return axios.createEmtryAxios()
}

function getArticleCount(articleQuery) {
  if (util.checkQueryParameter(articleQuery)) {
    return guestArticleApi.getArticleCount(articleQuery.pageSize, articleQuery.page, articleQuery.articleId, articleQuery.userId, articleQuery.sortId, articleQuery.title)
  }
  return axios.createEmtryAxios()
}

export default {
  viewArticle: viewArticle,
  createArticleQuery: createArticleQuery,
  listArticleVo: listArticleVo,
  getArticleCount: getArticleCount,
}

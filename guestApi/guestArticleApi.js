import axios from '../utils/axios'

const url = '/guest/article'

function viewArticle(articleId) {
  return axios.tokenAxiosMethod.get(url + '/viewArticle', {
      articleId: articleId,
  })
}

function listArticleVo(pageSize, page, articleId, userId, sortId, sort, title) {
  return axios.tokenAxiosMethod.get(url + '/listArticleVo', {
      pageSize: pageSize,
      page: page,
      articleId: articleId,
      userId: userId,
      sortId: sortId,
      sort: sort,
      title: title,
  })
}

function getArticleCount(pageSize, page, articleId, userId, sortId, title) {
  return axios.tokenAxiosMethod.get(url + '/getArticleCount', {
      pageSize: pageSize,
      page: page,
      articleId: articleId,
      userId: userId,
      sortId: sortId,
      title: title,
  })
}

export default {
  viewArticle: viewArticle,
  listArticleVo: listArticleVo,
  getArticleCount: getArticleCount,
}

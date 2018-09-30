import axios from '../utils/axios'

const url = '/guest/article'

function viewArticle(articleId) {
  return axios.instance.get(url + '/viewArticle', {
    params: {
      articleId: articleId,
    }
  })
}

function listArticleVo(pageSize, page, articleId, userId, sortId, sort, title) {
  return axios.instance.get(url + '/listArticleVo', {
    params: {
      pageSize: pageSize,
      page: page,
      articleId: articleId,
      userId: userId,
      sortId: sortId,
      sort: sort,
      title: title,
    }
  })
}

function getArticleCount(pageSize, page, articleId, userId, sortId, title) {
  return axios.instance.get(url + '/getArticleCount', {
    params: {
      pageSize: pageSize,
      page: page,
      articleId: articleId,
      userId: userId,
      sortId: sortId,
      title: title,
    }
  })
}

export default {
  viewArticle: viewArticle,
  listArticleVo: listArticleVo,
  getArticleCount: getArticleCount,
}

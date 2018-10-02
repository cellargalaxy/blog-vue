import axios from '../utils/axios'

const url = '/admin/article'

function addArticle(userId, sortId, title, markdown, view, tags) {
  return axios.tokenAxiosMethod.post(url + '/addArticle', {
    userId: userId,
    sortId: sortId,
    title: title,
    markdown: markdown,
    view: view,
    tags: tags,
  })
}

function removeArticle(articleId) {
  return axios.tokenAxiosMethod.post(url + '/removeArticle', {
    articleId: articleId,
  })
}

function changeArticle(articleId, userId, sortId, title, markdown, view) {
  return axios.tokenAxiosMethod.post(url + '/changeArticle', {
    articleId: articleId,
    userId: userId,
    sortId: sortId,
    title: title,
    markdown: markdown,
    view: view,
  })
}

function getArticle(articleId) {
  return axios.tokenAxiosMethod.get(url + '/getArticle', {
      articleId: articleId,
  })
}

function getArticleVo(articleId) {
  return axios.tokenAxiosMethod.get(url + '/getArticleVo', {
      articleId: articleId,
  })
}

function listArticle(pageSize, page, articleId, userId, sortId, title) {
  return axios.tokenAxiosMethod.get(url + '/listArticle', {
      pageSize: pageSize,
      page: page,
      articleId: articleId,
      userId: userId,
      sortId: sortId,
      title: title,
  })
}

function listArticleVo(pageSize, page, articleId, userId, sortId, title) {
  return axios.tokenAxiosMethod.get(url + '/listArticleVo', {
      pageSize: pageSize,
      page: page,
      articleId: articleId,
      userId: userId,
      sortId: sortId,
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
  addArticle: addArticle,
  removeArticle: removeArticle,
  changeArticle: changeArticle,
  getArticle: getArticle,
  getArticleVo: getArticleVo,
  listArticle: listArticle,
  listArticleVo: listArticleVo,
  getArticleCount: getArticleCount,
}

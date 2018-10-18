import axios from '../utils/axios'

const url = '/admin/article'

function addArticle(sortId, title, markdown, view, status) {
  return axios.tokenAxiosMethod.post(url + '/addArticle', {
    sortId: sortId,
    title: title,
    markdown: markdown,
    view: view,
    status: status,
  })
}

function removeArticle(articleId) {
  return axios.tokenAxiosMethod.post(url + '/removeArticle', {
    articleId: articleId,
  })
}

function changeArticle(articleId, userId, sortId, title, markdown, view, status) {
  return axios.tokenAxiosMethod.post(url + '/changeArticle', {
    articleId: articleId,
    userId: userId,
    sortId: sortId,
    title: title,
    markdown: markdown,
    view: view,
    status: status,
  })
}

function getArticle(articleId, createDate, title) {
  return axios.tokenAxiosMethod.get(url + '/getArticle', {
    articleId: articleId,
    createDate: createDate,
    title: title,
  })
}

function getArticleVo(articleId, createDate, title) {
  return axios.tokenAxiosMethod.get(url + '/getArticleVo', {
    articleId: articleId,
    createDate: createDate,
    title: title,
  })
}

function listArticle(pageSize, page) {
  return axios.tokenAxiosMethod.get(url + '/listArticle', {
    pageSize: pageSize,
    page: page,
  })
}

function listArticleVo(pageSize, page) {
  return axios.tokenAxiosMethod.get(url + '/listArticleVo', {
    pageSize: pageSize,
    page: page,
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
}

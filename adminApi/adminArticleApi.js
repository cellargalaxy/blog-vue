import axios from '../utils/axios'

const url = '/admin/article'

function addArticle(sortId, title, markdown, view, tags) {
  return axios.tokenAxiosMethod.post(url + '/addArticle', {
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

function getArticle(articleId, createDate, title) {
  return axios.tokenAxiosMethod.get(url + '/getArticle', {
    articleId: articleId,
    createDate: createDate,
    title: title,
  })
}

function getArticleVo(articleId) {
  return axios.tokenAxiosMethod.get(url + '/getArticleVo', {
    articleId: articleId,
  })
}

export default {
  addArticle: addArticle,
  removeArticle: removeArticle,
  changeArticle: changeArticle,
  getArticle: getArticle,
  getArticleVo: getArticleVo,
}

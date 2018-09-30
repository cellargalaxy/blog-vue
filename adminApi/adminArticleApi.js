import axios from '../utils/axios'

const url = '/admin/article'

function addArticle(userId, sortId, title, markdown, view, tags) {
  console.log(tags)

  return axios.instance.post(url + '/addArticle', {
    userId: userId,
    sortId: sortId,
    title: title,
    markdown: markdown,
    view: view,
    tags: tags,
  })
}

function removeArticle(articleId) {
  return axios.instance.post(url + '/removeArticle', {
    articleId: articleId,
  })
}

function changeArticle(articleId, userId, sortId, title, markdown, view) {
  return axios.instance.post(url + '/changeArticle', {
    articleId: articleId,
    userId: userId,
    sortId: sortId,
    title: title,
    markdown: markdown,
    view: view,
  })
}

function getArticle(articleId) {
  return axios.instance.get(url + '/getArticle', {
    params: {
      articleId: articleId,
    }
  })
}

function getArticleVo(articleId) {
  return axios.instance.get(url + '/getArticleVo', {
    params: {
      articleId: articleId,
    }
  })
}

function listArticle(pageSize, page, articleId, userId, sortId, title) {
  return axios.instance.get(url + '/listArticle', {
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

function listArticleVo(pageSize, page, articleId, userId, sortId, title) {
  return axios.instance.get(url + '/listArticleVo', {
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
  addArticle: addArticle,
  removeArticle: removeArticle,
  changeArticle: changeArticle,
  getArticle: getArticle,
  getArticleVo: getArticleVo,
  listArticle: listArticle,
  listArticleVo: listArticleVo,
  getArticleCount: getArticleCount,
}

import axios from '../utils/axios'

const url = '/admin/article'

function addArticle(userId, sortId, title, markdown, view) {
  return axios.instance.post(url + '/addArticle', {
      userId: userId,
      sortId: sortId,
      title: title,
      markdown: markdown,
      view: view,
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
  return axios.instance.get(url + '/getArticle', {params: {
    articleId: articleId,
  }})
}

function getArticleVo(articleId) {
  return axios.instance.get(url + '/getArticleVo', {params: {
      articleId: articleId,
    }})
}

function getUserCount(pageSize, page, articleId, userId, sortId, title, markdown, view) {
  return axios.instance.get(url + '/getArticleVo', {params: {
      pageSize: pageSize,
      page: page,
      articleId: articleId,
      userId: userId,
      sortId: sortId,
      title: title,
      markdown: markdown,
      view: view,
    }})
}

function listUser(pageSize, page, userId, username, createTime, updateTime) {
  return axios.instance.get(url + '/listUser', {
    params: {
      pageSize: pageSize,
      page: page,
      userId: userId,
      username: username,
      createTime: createTime,
      updateTime: updateTime
    }
  })
}

function getUserAuthorization(userId) {
  return axios.instance.get(url + '/getUserAuthorization', {params: {userId: userId}})
}

function listUserAuthorization(pageSize, page, userId, username, createTime, updateTime) {
  return axios.instance.get(url + '/listUserAuthorization', {
    params: {
      pageSize: pageSize,
      page: page,
      userId: userId,
      username: username,
      createTime: createTime,
      updateTime: updateTime
    }
  })
}

function getUserOwn(userId) {
  return axios.instance.get(url + '/getUserOwn', {params: {userId: userId}})
}

function listUserOwn(pageSize, page, userId, username, createTime, updateTime) {
  return axios.instance.get(url + '/listUserOwn', {
    pageSize: pageSize,
    page: page,
    userId: userId,
    username: username,
    createTime: createTime,
    updateTime: updateTime
  })
}


export default {
  addUser: addUser,
  removeUser: removeUser,
  getUser: getUser,
  getUserCount: getUserCount,
  listUser: listUser,
  getUserAuthorization: getUserAuthorization,
  listUserAuthorization: listUserAuthorization,
  getUserOwn: getUserOwn,
  listUserOwn: listUserOwn,
  changeUser: changeUser,
  checkAddUser: checkAddUser,
  checkChangeUser: checkChangeUser,
}

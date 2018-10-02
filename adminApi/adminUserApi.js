import axios from '../utils/axios'

const url = '/admin/user'

function addUser(username, password) {
  return axios.tokenAxiosMethod.post(url + '/addUser', {
    username: username,
    password: password,
  })
}

function removeUser(userId) {
  return axios.tokenAxiosMethod.post(url + '/removeUser', {
    userId: userId,
  })
}

function changeUser(userId, username, password) {
  return axios.tokenAxiosMethod.post(url + '/changeUser', {
    userId: userId,
    username: username,
    password: password,
  })
}

function getUserVo(userId) {
  return axios.tokenAxiosMethod.get(url + '/getUserVo', {
      userId: userId,
  })
}

function listAllUserVo() {
  return axios.tokenAxiosMethod.get(url + '/listAllUserVo', {
  })
}

function listAllPermission() {
  return axios.tokenAxiosMethod.get(url + '/listAllPermission', {
  })
}

export default {
  addUser: addUser,
  removeUser: removeUser,
  changeUser: changeUser,
  getUserVo: getUserVo,
  listAllUserVo: listAllUserVo,
  listAllPermission: listAllPermission,
}

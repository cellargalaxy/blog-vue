import axios from '../utils/axios'

const url = '/admin/user'

function addUser(username, password) {
  return axios.instance.post(url + '/addUser', {
    username: username,
    password: password,
  })
}

function removeUser(userId) {
  return axios.instance.post(url + '/removeUser', {
    userId: userId,
  })
}

function changeUser(userId, username, password) {
  return axios.instance.post(url + '/changeUser', {
    userId: userId,
    username: username,
    password: password,
  })
}

function getUserVo(userId) {
  return axios.instance.get(url + '/getUserVo', {
    params: {
      userId: userId,
    }
  })
}

function listAllUserVo() {
  return axios.instance.get(url + '/listAllUserVo', {
    params: {}
  })
}

function listAllPermission() {
  return axios.instance.get(url + '/listAllPermission', {
    params: {}
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

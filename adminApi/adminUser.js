import util from '../utils/util'
import axios from '../utils/axios'
import adminUserApi from './adminUserApi'

function addUser(user) {
  if (!axios.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认添加账号？', user, 'username', 'password')) {
    return adminUserApi.addUser(user.username, user.password)
  }
  return axios.createEmptyResponse()
}

function removeUser(user) {
  if (!axios.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认删除账号？', user, 'userId')) {
    return adminUserApi.removeUser(user.userId)
  }
  return axios.createEmptyResponse()
}

function changeUser(user) {
  if (!axios.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认修改账号？', user, 'userId')) {
    return adminUserApi.changeUser(user.userId, user.username, user.password)
  }
  return axios.createEmptyResponse()
}

function getUserVo(user) {
  if (!axios.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  return adminUserApi.getUserVo(user.userId)
}

function listAllUserVo() {
  if (!axios.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  return adminUserApi.listAllUserVo()
}

function listAllPermission() {
  if (!axios.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  return adminUserApi.listAllPermission()
}

export default {
  addUser: addUser,
  removeUser: removeUser,
  changeUser: changeUser,
  getUserVo: getUserVo,
  listAllUserVo: listAllUserVo,
  listAllPermission: listAllPermission,
}

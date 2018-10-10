import util from '../utils/util'
import account from '../utils/account'
import axios from '../utils/axios'
import adminUserApi from './adminUserApi'
import adminArticleApi from "./adminArticleApi";

function addUser(user) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认添加账号？', user, 'username', 'password')) {
    return adminUserApi.addUser(user.username, user.password)
  }
  return axios.createEmptyResponse()
}

function removeUser(user) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认删除账号？', user, 'userId')) {
    return adminUserApi.removeUser(user.userId)
  }
  return axios.createEmptyResponse()
}

function changeUser(user) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认修改账号？', user, 'userId')) {
    return adminUserApi.changeUser(user.userId, user.username, user.password)
  }
  return axios.createEmptyResponse()
}

function getUser(user) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd(null, user, 'userId')) {
    return adminArticleApi.getUser(user.userId)
  }
  return axios.createEmptyResponse()
}

function listAllUser() {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  return adminArticleApi.listAllUser()
}

function listAllUserVo() {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  return adminArticleApi.listAllUserVo()
}

function listAllPermission() {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  return adminArticleApi.listAllPermission()
}


export default {
  addUser: addUser,
  removeUser: removeUser,
  changeUser: changeUser,
  getUserVo: getUserVo,
  listAllUserVo: listAllUserVo,
  listAllPermission: listAllPermission,
}

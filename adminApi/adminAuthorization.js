import util from '../utils/util'
import account from '../utils/account'
import axios from '../utils/axios'
import adminAuthorizationApi from './adminAuthorizationApi'

function addAuthorization(authorization) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认添加授权？', authorization, 'userId', 'permission')) {
    return adminAuthorizationApi.addAuthorization(authorization.userId, authorization.permission)
  }
  return axios.createEmptyResponse()
}

function removeAuthorization(authorization) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认删除授权？', authorization, 'authorizationId')) {
    return adminAuthorizationApi.removeAuthorization(authorization.authorizationId)
  }
  return axios.createEmptyResponse()
}

export default {
  addAuthorization: addAuthorization,
  removeAuthorization: removeAuthorization,
}

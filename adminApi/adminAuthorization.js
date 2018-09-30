import util from '../utils/util'
import axios from '../utils/axios'
import adminAuthorizationApi from './adminAuthorizationApi'

function addAuthorization(authorization) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认添加授权？', authorization, 'userId', 'permission')) {
    return adminAuthorizationApi.addAuthorization(authorization.userId, authorization.permission)
  }
  return axios.createEmtryAxios()
}

function removeAuthorization(authorization) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认删除授权？', authorization, 'authorizationId')) {
    return adminAuthorizationApi.removeAuthorization(authorization.authorizationId)
  }
  return axios.createEmtryAxios()
}

export default {
  addAuthorization: addAuthorization,
  removeAuthorization: removeAuthorization,
}

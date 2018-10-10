import util from '../utils/util'
import account from '../utils/account'
import axios from '../utils/axios'
import adminSortApi from './adminSortApi'

function addSort(sort) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认添加分类？', sort, 'sort')) {
    return adminSortApi.addSort(sort.sort)
  }
  return axios.createEmptyResponse()
}

function removeSort(sort) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认删除分类？', sort, 'sortId')) {
    return adminSortApi.removeSort(sort.sortId)
  }
  return axios.createEmptyResponse()
}

function changeSort(sort) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认修改分类？', sort, 'sortId')) {
    return adminSortApi.changeSort(sort.sortId, sort.sort)
  }
  return axios.createEmptyResponse()
}

export default {
  addSort: addSort,
  removeSort: removeSort,
  changeSort: changeSort,
}

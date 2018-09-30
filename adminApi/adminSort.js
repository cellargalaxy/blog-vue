import util from '../utils/util'
import axios from '../utils/axios'
import adminSortApi from './adminSortApi'

function addSort(sort) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认添加分类？', sort, 'sort')) {
    return adminSortApi.addSort(sort.sort)
  }
  return axios.createEmtryAxios()
}

function removeSort(sort) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认删除分类？', sort, 'sortId')) {
    return adminSortApi.removeSort(sort.sortId)
  }
  return axios.createEmtryAxios()
}

function changeSort(sort) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认修改分类？', sort, 'sortId')) {
    return adminSortApi.changeSort(sort.sortId, sort.sort)
  }
  return axios.createEmtryAxios()
}

function listAllSort() {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  return adminSortApi.listAllSort()
}

export default {
  addSort: addSort,
  removeSort: removeSort,
  changeSort: changeSort,
  listAllSort: listAllSort,
}

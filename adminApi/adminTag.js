import util from '../utils/util'
import account from '../utils/account'
import axios from '../utils/axios'
import adminTagApi from './adminTagApi'

function addTag(tag) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认添加标签？', tag, 'articleId', 'tag')) {
    return adminTagApi.addTag(tag.articleId, tag.tag)
  }
  return axios.createEmptyResponse()
}

function removeTag(tag) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认删除标签？', tag, 'tagId')) {
    return adminTagApi.removeTag(tag.tagId)
  }
  return axios.createEmptyResponse()
}

function changeTag(tag) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认修改标签？', tag, 'tagId')) {
    return adminTagApi.changeTag(tag.tagId, tag.articleId, tag.tag)
  }
  return axios.createEmptyResponse()
}

export default {
  addTag: addTag,
  removeTag: removeTag,
  changeTag: changeTag,
}

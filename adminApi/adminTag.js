import util from '../utils/util'
import axios from '../utils/axios'
import adminTagApi from './adminTagApi'

function removeTag(tag) {
  if (!axios.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认删除标签？', tag, 'tagId')) {
    return adminTagApi.removeTag(tag.tagId)
  }
  return axios.createEmptyResponse()
}

function changeTag(tag) {
  if (!axios.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认修改标签？', tag, 'tagId')) {
    return adminTagApi.changeTag(tag.tagId, tag.articleId, tag.tag)
  }
  return axios.createEmptyResponse()
}

export default {
  removeTag: removeTag,
  changeTag: changeTag,
}

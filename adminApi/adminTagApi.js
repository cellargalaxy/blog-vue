import axios from '../utils/axios'

const url = '/admin/tag'

function addTag(articleId, tag) {
  return axios.tokenAxiosMethod.post(url + '/addTag', {
    articleId: articleId,
    tag: tag,
  })
}

function removeTag(tagId) {
  return axios.tokenAxiosMethod.post(url + '/removeTag', {
    tagId: tagId,
  })
}

function changeTag(tagId, articleId, tag) {
  return axios.tokenAxiosMethod.post(url + '/changeTag', {
    tagId: tagId,
    articleId: articleId,
    tag: tag,
  })
}

export default {
  addTag: addTag,
  removeTag: removeTag,
  changeTag: changeTag,
}

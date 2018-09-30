import axios from '../utils/axios'

const url = '/admin/tag'

function removeTag(tagId) {
  return axios.instance.post(url + '/removeTag', {
    tagId: tagId,
  })
}

function changeTag(tagId, articleId, tag) {
  return axios.instance.post(url + '/changeTag', {
    tagId: tagId,
    articleId: articleId,
    tag: tag,
  })
}

export default {
  removeTag: removeTag,
  changeTag: changeTag,
}

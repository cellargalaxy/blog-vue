import axios from '../utils/axios'

const url = '/admin/comment'

function removeComment(commentId) {
  return axios.tokenAxiosMethod.post(url + '/removeComment', {
    commentId: commentId,
  })
}

function changeComment(commentId, userId, articleId, markdown) {
  return axios.tokenAxiosMethod.post(url + '/changeComment', {
    commentId: commentId,
    userId: userId,
    articleId: articleId,
    markdown: markdown,
  })
}

export default {
  removeComment: removeComment,
  changeComment: changeComment,
}

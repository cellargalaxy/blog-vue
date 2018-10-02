import axios from '../utils/axios'

const url = '/guest/comment'

function addComment(userId, articleId, markdown) {
  return axios.tokenAxiosMethod.post(url + '/addComment', {
    userId: userId,
    articleId: articleId,
    markdown: markdown,
  })
}

export default {
  addComment: addComment,
}

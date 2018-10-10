import axios from '../utils/axios'

const url = '/guest/comment'

function addComment(articleId, markdown) {
  return axios.tokenAxiosMethod.post(url + '/addComment', {
    articleId: articleId,
    markdown: markdown,
  })
}

function listCommentByArticleId(articleId) {
  return axios.tokenAxiosMethod.get(url + '/listCommentByArticleId', {
    articleId: articleId,
  })
}

export default {
  addComment: addComment,
  listCommentByArticleId: listCommentByArticleId,
}

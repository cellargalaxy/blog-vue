import util from '../utils/util'
import axios from '../utils/axios'
import adminCommentApi from './adminCommentApi'

function removeComment(comment) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认删除评论？', comment, 'commentId')) {
    return adminCommentApi.removeComment(comment.commentId)
  }
  return axios.createEmtryAxios()
}

function changeComment(comment) {
  if (!axios.logined()) {
    return axios.createEmtryAxios()
  }
  if (util.checkParameterAnd('确认修改评论？', comment, 'commentId')) {
    return adminCommentApi.changeComment(comment.commentId, comment.userId, comment.articleId, comment.markdown)
  }
  return axios.createEmtryAxios()
}

export default {
  removeComment: removeComment,
  changeComment: changeComment,
}

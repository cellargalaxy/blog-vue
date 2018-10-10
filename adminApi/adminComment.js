import util from '../utils/util'
import account from '../utils/account'
import axios from '../utils/axios'
import adminCommentApi from './adminCommentApi'

function removeComment(comment) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认删除评论？', comment, 'commentId')) {
    return adminCommentApi.removeComment(comment.commentId)
  }
  return axios.createEmptyResponse()
}

function changeComment(comment) {
  if (!account.logined()) {
    util.errorInfo('请登录')
    return axios.createEmptyResponse()
  }
  if (util.checkParameterAnd('确认修改评论？', comment, 'commentId')) {
    return adminCommentApi.changeComment(comment.commentId, comment.userId, comment.articleId, comment.markdown)
  }
  return axios.createEmptyResponse()
}

export default {
  removeComment: removeComment,
  changeComment: changeComment,
}

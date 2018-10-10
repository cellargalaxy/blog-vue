import guestCommentApi from './guestCommentApi'
import axios from "../utils/axios";
import util from "../utils/util";

function addComment(comment) {
  if (util.checkParameterAnd('确认添加评论？', comment, 'articleId', 'markdown')) {
    return guestCommentApi.addComment(comment.articleId, comment.markdown)
  }
  return axios.createEmptyResponse()
}

function listCommentByArticleId(comment) {
  if (util.checkParameterAnd(null, comment, 'articleId')) {
    return guestCommentApi.listCommentByArticleId(comment.articleId)
  }
  return axios.createEmptyResponse()
}

export default {
  addComment: addComment,
  listCommentByArticleId: listCommentByArticleId,
}

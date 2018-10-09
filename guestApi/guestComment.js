import guestCommentApi from './guestCommentApi'
import axios from "../utils/axios";
import util from "../utils/util";

function addComment(comment) {
  if (util.checkParameterAnd('确认添加评论？', comment, 'articleId', 'markdown')) {
    return guestCommentApi.addComment(comment.userId, comment.articleId, comment.markdown)
  }
  return axios.createEmptyResponse()
}


function listCommentByArticleId(pageSize, page, articleId, userId, sortId, sort, title) {
  return axios.tokenAxiosMethod.get(url + '/listCommentByArticleId', {
    pageSize: pageSize,
    page: page,
    articleId: articleId,
    userId: userId,
    sortId: sortId,
    sort: sort,
    title: title,
  })
}

export default {
  addComment: addComment,
  listCommentByArticleId: listCommentByArticleId,
}

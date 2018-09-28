import util from '../utils/util'

function isNumber(val) {
  return val != null && !isNaN(val)
}

function initArticle(article) {
  if (isNumber(article.createTime)) {
    article.createTime = util.formatTimestamp(article.createTime, 'yyyy-MM-dd')
  }
  if (isNumber(article.updateTime)) {
    article.updateTime = util.formatTimestamp(article.updateTime, 'yyyy-MM-dd')
  }
  article.html=util.markdown2html(article.markdown)
  article.url='/article/'+article.articleId
  return article
}

function initTag(tag) {
  if (isNumber(tag.createTime)) {
    tag.createTime = util.formatTimestamp(tag.createTime, 'yyyy-MM-dd')
  }
  if (isNumber(tag.updateTime)) {
    tag.updateTime = util.formatTimestamp(tag.updateTime, 'yyyy-MM-dd')
  }
  return tag
}

function initComment(comment) {
  if (isNumber(comment.createTime)) {
    comment.createTime = util.formatTimestamp(comment.createTime, 'yyyy-MM-dd')
  }
  if (isNumber(comment.updateTime)) {
    comment.updateTime = util.formatTimestamp(comment.updateTime, 'yyyy-MM-dd')
  }
  comment.html=util.markdown2html(comment.markdown)
  return comment
}

export default {
  initArticle:initArticle,
  initTag:initTag,
  initComment:initComment,
}

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
  article.url = '/article/' + article.articleId
  article.html = util.markdown2htmlWithHtml(article.markdown)
  let summaryMarkdown = ''
  let strings = article.markdown.split(/[\n]/);
  let hangCount = 0
  for (let i = 0; i < strings.length && hangCount < 5; i++) {
    summaryMarkdown = summaryMarkdown + strings[i] + '\n'
    if (strings[i].trim() == '') {
      hangCount = hangCount + 1
    }
  }
  article.summary = util.markdown2htmlWithHtml(summaryMarkdown)
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
    comment.createTime = util.formatTimestamp(comment.createTime, 'yyyy-MM-dd hh:mm:ss')
  }
  if (isNumber(comment.updateTime)) {
    comment.updateTime = util.formatTimestamp(comment.updateTime, 'yyyy-MM-dd hh:mm:ss')
  }
  comment.html = util.markdown2htmlWithoutHtml(comment.markdown)
  return comment
}

export default {
  initArticle:initArticle,
  initTag:initTag,
  initComment:initComment,
}

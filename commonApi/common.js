import util from '../utils/util'
import markdown from '../utils/markdown'

function isNumber(val) {
  return val != null && !isNaN(val)
}

function initArticle(article) {
  if (article == null) {
    return
  }
  if (isNumber(article.createDate)) {
    article.createDate = util.formatTimestamp(article.createDate, 'yyyy-MM-dd')
  }
  if (isNumber(article.createTime)) {
    article.createTime = util.formatTimestamp(article.createTime, 'hh:mm:ss')
  }
  if (isNumber(article.updateDate)) {
    article.updateDate = util.formatTimestamp(article.updateDate, 'yyyy-MM-dd')
  }
  if (isNumber(article.updateTime)) {
    article.updateTime = util.formatTimestamp(article.updateTime, 'hh:mm:ss')
  }

  article.statusName = getArticleStatusName(article.status)
  article.url = '/article/' + article.createDate + '/' + article.title
  article.html = markdown.markdown2htmlWithHtml(article.markdown)
  let summaryMarkdown = ''
  if (article.markdown != null) {
    let strings = article.markdown.split(/[\n]/);
    let hangCount = 0
    for (let i = 0; i < strings.length && hangCount < 5; i++) {
      summaryMarkdown = summaryMarkdown + strings[i] + '\n'
      if (strings[i].trim() == '') {
        hangCount = hangCount + 1
      }
    }
  }
  article.summary = markdown.markdown2htmlWithHtml(summaryMarkdown)
  return article
}

function getArticleStatusName(status) {
  if (status == 1) {
    return '编辑'
  }
  if (status == 2) {
    return '发表'
  }
  if (status == 3) {
    return '禁用'
  }
  return status
}

function initTag(tag) {
  if (tag == null) {
    return
  }
  if (isNumber(tag.createTime)) {
    tag.createTime = util.formatTimestamp(tag.createTime, 'yyyy-MM-dd')
  }
  if (isNumber(tag.updateTime)) {
    tag.updateTime = util.formatTimestamp(tag.updateTime, 'yyyy-MM-dd')
  }
  return tag
}

function initComment(comment) {
  if (comment == null) {
    return
  }
  if (isNumber(comment.createTime)) {
    comment.createTime = util.formatTimestamp(comment.createTime, 'yyyy-MM-dd hh:mm:ss')
  }
  if (isNumber(comment.updateTime)) {
    comment.updateTime = util.formatTimestamp(comment.updateTime, 'yyyy-MM-dd hh:mm:ss')
  }
  comment.html = markdown.markdown2htmlWithoutHtml(comment.markdown)
  return comment
}

export default {
  initArticle: initArticle,
  initTag: initTag,
  initComment: initComment,
}

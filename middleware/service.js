import util from "./util";

function content2Archives(contents) {
  const articles = content2Articles(contents)
  return article2Archives(articles)
}

function article2Archives(articles) {
  const articleMap = {}
  for (let i = 0; i < articles.length; i++) {
    const month = util.formatDate(articles[i].createdAt, 'YYYY-MM')
    if (articleMap[month] === undefined || articleMap[month] == null) {
      articleMap[month] = []
    }
    articleMap[month].push(articles[i])
  }

  const months = []
  for (let month in articleMap){
    months.push(month)
  }

  months.sort()
  const archives = []
  for (let i = 0; i < months.length; i++) {
    const archive = {}
    archive.dateString = months[i]
    archive.files = sortArticle(articleMap[months[i]])
    archives.push(archive)
  }
  return archives
}

function sortArticle(articles) {
  const keys = []
  const articleMap = {}
  for (let i = 0; i < articles.length; i++) {
    const key = util.formatDate(articles[i].createdAt, 'YYYY-MM-DD') + articles[i].title
    keys.push(key)
    articleMap[key] = articles[i]
  }

  keys.sort()
  articles = []
  for (let i = 0; i < keys.length; i++) {
    articles.push(articleMap[keys[i]])
  }
  return articles
}

function content2Articles(contents) {
  const articles = []
  for (let i = 0; i < contents.length; i++) {
    articles.push(content2Article(contents[i], true))
  }
  return articles
}

function content2Article(content, isSummary) {
  const article = {}
  article.title = content.slug
  article.toc = content.toc
  article.body = isSummary ? content.excerpt : content.body
  article.path = '#'
  if (content.basePath && content.path) {
    article.path = content.basePath + content.path
  }
  article.createdAt = new Date(content.createdAt)
  article.updatedAt = new Date(content.updatedAt)

  article.attributes = []
  if (content.attributes) {
    for (let i = 0; i < content.attributes.length; i++) {
      article.attributes.push(content.attributes[i])
    }
  }
  article.attributes.push({name: "createdAt", value: util.formatDate(article.createdAt, 'YYYY-MM-DD')})
  article.attributes.push({name: "updatedAt", value: util.formatDate(article.updatedAt, 'YYYY-MM-DD')})

  return article
}

export default {
  content2Article: content2Article,
  content2Archives: content2Archives,
}

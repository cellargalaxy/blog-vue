import util from "./util";

function content2Archives(contents) {
  const files = content2Files(contents)
  return file2Archives(files)
}

function file2Archives(files) {
  const fileMap = {}
  for (let i = 0; i < files.length; i++) {
    const month = util.formatDate(files[i].createAt, 'YYYY-MM')
    if (fileMap[month] === undefined || fileMap[month] == null) {
      fileMap[month] = []
    }
    fileMap[month].push(files[i])
  }

  const months = []
  for (let month in fileMap) {
    months.push(month)
  }
  months.sort()

  const archives = []
  for (let i = 0; i < months.length; i++) {
    const archive = {}
    archive.dateString = months[i]
    archive.files = sortFile(fileMap[months[i]])
    archives.push(archive)
  }
  return archives
}

function sortFile(files) {
  const fileMap = {}
  for (let i = 0; i < files.length; i++) {
    const key = files[i].createdAt + files[i].title
    fileMap[key] = files[i]
  }

  const keys = []
  for (let key in fileMap) {
    keys.push(key)
  }
  keys.sort()

  files = []
  for (let i = 0; i < keys.length; i++) {
    files.push(fileMap[keys[i]])
  }
  return files
}

function content2Article(content, isSummary) {
  const article = content2File(content)
  if (article === undefined || article == null) {
    return article
  }

  article.toc = content.toc
  article.body = isSummary ? content.excerpt : content.body

  return article
}

function content2Files(contents) {
  const files = []
  for (let i = 0; i < contents.length; i++) {
    files.push(content2File(contents[i]))
  }
  return files
}

function content2File(content) {
  if (content === undefined || content == null) {
    return content
  }

  const file = {}
  file.title = content.slug
  file.url = '#'
  if (content.basePath && content.path) {
    file.url = content.basePath + content.path
  }
  file.createAt = new Date(content.createdAt)
  file.updateAt = new Date(content.updatedAt)

  file.attributes = []
  if (content.attributes) {
    for (let i = 0; i < content.attributes.length; i++) {
      file.attributes.push(content.attributes[i])
    }
  }
  file.attributes.push({name: "createAt", value: util.formatDate(file.createAt, 'YYYY-MM-DD')})
  file.attributes.push({name: "updateAt", value: util.formatDate(file.updateAt, 'YYYY-MM-DD')})

  return file
}

function setBasePaths(contents, basePath) {
  if (contents === undefined || contents == null) {
    return contents
  }
  for (let i = 0; i < contents.length; i++) {
    contents[i] = setBasePath(contents[i], basePath)
  }
  return contents
}

function setBasePath(content, basePath) {
  if (content === undefined || content == null) {
    return content
  }
  const copy = {}
  for (let key in content) {
    copy[key] = content[key]
  }
  copy.basePath = basePath
  return copy
}

export default {
  content2Archives: content2Archives,
  content2Article: content2Article,
  setBasePaths: setBasePaths,
  setBasePath: setBasePath,
}

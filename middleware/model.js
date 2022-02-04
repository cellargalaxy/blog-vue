import util from "./util"
import * as path from "path";

function sortContent(contents) {
  if (contents === undefined || contents == null) {
    return contents
  }

  const contentMap = {}
  for (let i = 0; i < contents.length; i++) {
    const key = contents[i].createdAt + contents[i].path
    contentMap[key] = contents[i]
  }

  const keys = []
  for (let key in contentMap) {
    keys.push(key)
  }
  keys.sort()

  contents = []
  for (let i = 0; i < keys.length; i++) {
    contents.push(contentMap[keys[i]])
  }
  return contents
}

function setAttribute(object, attribute) {
  if (object === undefined || object == null) {
    return object
  }
  if (attribute === undefined || attribute == null) {
    return object
  }
  if (object.attributes === undefined || object.attributes == null) {
    object.attributes = []
  }
  for (let i = 0; i < object.attributes.length; i++) {
    if (object.attributes[i].name === attribute.name) {
      object.attributes[i] = attribute
      return object
    }
  }
  object.attributes.push(attribute)
  return object
}

function content2File(content) {
  if (content === undefined || content == null) {
    return content
  }

  content.title = content.slug
  content.url = path.join('/view', content.path)
  content.createAt = new Date(content.createdAt)
  content.updateAt = new Date(content.updatedAt)

  content = setAttribute(content, {name: "createAt", value: util.formatDate(content.createAt, 'YYYY-MM-DD')})
  content = setAttribute(content, {name: "updateAt", value: util.formatDate(content.updateAt, 'YYYY-MM-DD')})
  let sortUrl = path.join('/page', content.dir)
  if (!util.endWith(sortUrl, '/')) {
    sortUrl += '/'
  }
  sortUrl += '1/'
  content.sortUrl = sortUrl
  content = setAttribute(content, {name: "sort", value: content.dir, url: sortUrl})
  return content
}

function content2Files(contents) {
  const files = []
  for (let i = 0; i < contents.length; i++) {
    const file = content2File(contents[i])
    if (file === undefined || file == null) {
      continue
    }
    files.push(file)
  }
  return files
}

function file2Article(file, isSummary) {
  if (file === undefined || file == null) {
    return file
  }
  file.body = isSummary ? file.excerpt : file.body
  return file
}

function file2Archives(files) {
  if (files === undefined || files == null) {
    return files
  }
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
    archive.month = months[i]
    archive.files = sortContent(fileMap[months[i]])
    archives.push(archive)
  }
  return archives
}

export default {
  sortContent: sortContent,
  content2Files: content2Files,
  file2Article: file2Article,
  file2Archives: file2Archives,
}

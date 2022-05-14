import util from "./util"
import path from "path"

function encodeUrl(url) {
  if (url === undefined || url == null) {
    return ''
  }
  if (!util.endWith(url, '/')) {
    url += '/'
  }
  url = encodeURI(url)
  url = url.replaceAll('$', '$$')
  url = url.replaceAll('%', '$')
  return url
}

function decodeUrl(url) {
  if (url === undefined || url == null) {
    return ''
  }
  if (!util.endWith(url, '/')) {
    url += '/'
  }
  url = url.replaceAll('$', '%')
  url = url.replaceAll('%%', '$')
  url = decodeURI(url)
  return url
}

function sortContentByLevel(contents) {
  if (contents === undefined || contents == null) {
    return contents
  }

  const levelMap = {}
  for (let i = 0; i < contents.length; i++) {
    const level = util.string2Int(contents[i].level)
    if (levelMap[level] === undefined || levelMap[level] == null) {
      levelMap[level] = []
    }
    levelMap[level].push(contents[i])
  }

  const levels = []
  for (let level in levelMap) {
    levels.push(level)
    levelMap[level] = sortContentByTime(levelMap[level])
  }
  levels.sort()

  contents = []
  for (let i = 0; i < levels.length; i++) {
    const list = levelMap[levels[i]]
    for (let j = 0; j < list.length; j++) {
      contents.push(list[j])
    }
  }
  return contents
}

function sortContentByTime(contents) {
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
  if (attribute.url !== undefined) {
    attribute.url = encodeUrl(attribute.url)
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

function content2File(content, basePath) {
  if (content === undefined || content == null) {
    return content
  }

  if (content.title === undefined || content.title == null || content.title === '') {
    content.title = content.slug
  }
  content.url = path.join(basePath, '/view', content.path)
  content.url = encodeUrl(content.url)
  content.createAt = new Date(content.createdAt)
  content.updateAt = new Date(content.updatedAt)

  content = setAttribute(content, {name: "createAt", value: util.formatDate(content.createAt, 'YYYY-MM-DD')})
  content = setAttribute(content, {name: "updateAt", value: util.formatDate(content.updateAt, 'YYYY-MM-DD')})

  let sortUrl = path.join(basePath, '/page', content.dir)
  if (!util.endWith(sortUrl, '/')) {
    sortUrl += '/'
  }
  sortUrl += '1/'
  content = setAttribute(content, {name: "sort", value: content.dir, url: sortUrl})

  const level = content.level
  if (level !== undefined && level != null && util.isNum(level)) {
    content = setAttribute(content, {name: "level", value: level})
  }

  return content
}

function content2Files(contents, basePath) {
  const files = []
  for (let i = 0; i < contents.length; i++) {
    const file = content2File(contents[i], basePath)
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
    archive.files = sortContentByTime(fileMap[months[i]])
    archives.push(archive)
  }
  return archives
}

export default {
  encodeUrl: encodeUrl,
  decodeUrl: decodeUrl,
  sortContentByLevel: sortContentByLevel,
  sortContentByTime: sortContentByTime,
  content2Files: content2Files,
  file2Article: file2Article,
  file2Archives: file2Archives,
}

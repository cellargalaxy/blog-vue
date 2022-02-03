import util from "./util"
import model from "./model"
import config from "./config"

function initPath(path) {
  //-> a/b/1/
  if (util.endWith(path, '/')) {
    path = path.substring(0, path.length - 1) //-> a/b/1
  }
  return path
}

function parsePath(path) {
  path = initPath(path) //-> a/b/1
  let index = path.lastIndexOf("/")
  let folderPath = path.substring(0, index)//-> a/b
  let currentPage = path.substring(index + 1, path.length)//-> 1
  currentPage = util.string2Int(currentPage)
  return {folderPath, currentPage}
}

function content2Files(contents, basePath) {
  if (contents.length === undefined) {
    contents = [contents]
  }
  let copies = []
  main: for (let i = 0; i < contents.length; i++) {
    if (contents[i].path === '/config' && contents[i].extension === '.json') {
      continue
    }
    const names = contents[i].path.split('/')
    for (let j = 0; j < names.length; j++) {
      if (util.startWith(names[j], '.')) {
        continue main
      }
    }
    copies.push(contents[i])
  }
  copies = setBasePaths(copies, basePath)
  const files = model.content2Files(copies)
  return files
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
  content.basePath = basePath
  return content
}

function page(list, currentPage, pageSize) {
  if (list === undefined || list == null) {
    return list
  }
  if (currentPage === undefined || currentPage == null || currentPage <= 0) {
    currentPage = 1
  }
  if (pageSize === undefined || pageSize == null || pageSize <= 0) {
    pageSize = 10
  }
  const skipNum = (currentPage - 1) * pageSize
  const page = (skipNum + pageSize >= list.length) ? list.slice(skipNum, list.length) : list.slice(skipNum, skipNum + pageSize)
  return page
}

function getBasePath() {
  const site = config.getSiteConfig()
  let basePath = site.basePath
  if (basePath === undefined || basePath == null) {
    basePath = '/'
  }
  return process.env.DEPLOY_ENV === 'DEV' ? '/' : basePath
}

export default {
  initPath: initPath,
  parsePath: parsePath,
  content2Files: content2Files,
  page: page,
  getBasePath: getBasePath,
}

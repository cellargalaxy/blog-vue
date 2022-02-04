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

function content2Files(contents) {
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
  const basePath = getBasePath()
  const files = model.content2Files(copies, basePath)
  return files
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
  return process.env.DEPLOY_ENV === 'DEV' ? '/blog-vue/dist/' : basePath
}

async function listRoute(files) {
  const routeMap = {}
  for (let i = 0; i < files.length; i++) {
    routeMap[files[i].url] = files[i].url
    routeMap[files[i].sortUrl] = files[i].sortUrl
  }
  const basePath = getBasePath()
  const routes = []
  for (let key in routeMap) {
    if (key === undefined || key == null) {
      continue
    }
    key = key.replace(basePath, '')
    routes.push(key)
  }
  return routes
}

export default {
  initPath: initPath,
  parsePath: parsePath,
  content2Files: content2Files,
  page: page,
  getBasePath: getBasePath,
  listRoute: listRoute,
}

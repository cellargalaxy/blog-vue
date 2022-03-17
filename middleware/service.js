import util from "./util"
import model from "./model"
import config from "./config"
import path from "path"

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
  const urlReplace = getUrlReplace()
  copies = initContentImgs(copies, urlReplace)
  const basePath = getBasePath()
  const files = model.content2Files(copies, basePath)
  return files
}

function initContentImgs(contents, replaceMap) {
  for (let i = 0; i < contents.length; i++) {
    contents[i] = initContentImg(contents[i], replaceMap)
  }
  return contents
}

function initContentImg(content, replaceMap) {
  content.body = initImg(content.body, replaceMap)
  content.excerpt = initImg(content.excerpt, replaceMap)
  return content
}

function initImg(body, replaceMap) {
  if (body === undefined || body == null) {
    return body
  }
  if (body.tag === 'img' && body.props !== undefined && body.props != null) {
    let url = body.props['src']
    for (let old in replaceMap) {
      url = url.replace(old, replaceMap[old])
    }
    // body.props['src'] = url
    delete body.props['src']
    body.props['data-src'] = url
    return body
  }
  if (body.children === undefined || body.children == null) {
    return body
  }
  for (let i = 0; i < body.children.length; i++) {
    body.children[i] = initImg(body.children[i], replaceMap)
  }
  return body
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

function getUrlReplace() {
  const site = config.getSiteConfig()
  let urlReplace = site.urlReplace
  if (urlReplace === undefined || urlReplace == null) {
    urlReplace = {}
  }
  return urlReplace
}

async function listRoute(files) {
  const sortMap = {}
  const routeMap = {}
  routeMap['/archive/0'] = ''
  for (let i = 0; i < files.length; i++) {
    sortMap[files[i].dir] = ''

    routeMap[path.join('/view', files[i].path)] = ''
    const year = util.formatDate(files[i].createAt, 'YYYY')
    routeMap[path.join('/archive', year)] = ''
  }

  for (let sort in sortMap) {
    const list = listSortRoute(files, sort)
    for (let i = 0; i < list.length; i++) {
      routeMap[list[i]] = ''
    }
  }

  const routes = []
  for (let route in routeMap) {
    if (route === undefined || route == null) {
      continue
    }
    routes.push(route)
  }
  return routes
}

function listSortRoute(files, sort) {
  let count = 0
  for (let i = 0; i < files.length; i++) {
    if (util.startWith(files[i].dir, sort)) {
      count++
    }
  }
  const pageSize = config.getSiteConfig().pageSize
  let page = count / pageSize
  if (count % pageSize > 0) {
    page++
  }
  const routes = []
  for (let i = 1; i <= page; i++) {
    routes.push(path.join('/page', sort, i + ''))
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

import util from "./util"
import model from "./model"
import config from "./config"
import path from "path"

function initPath(path) {
  path = model.decodeUrl(path)
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
  const urlReplace = getSiteConfig().urlReplace
  copies = initContentImgs(copies, urlReplace)
  const basePath = getSiteConfig().basePath
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
      if (old === undefined || old == null || old === '') {
        continue
      }
      const regex = new RegExp(old)
      url = url.replace(regex, replaceMap[old])
    }
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

function listCrumb(folderPath) {
  let rootPath = path.join(getSiteConfig().basePath, '/page')
  const crumbs = []
  const paths = folderPath.split('/')
  let url = rootPath
  for (let i = 0; i < paths.length; i++) {
    if (paths[i] === undefined || paths[i] == null || paths[i] === '') {
      continue
    }
    url = path.join(url, paths[i])
    crumbs.push({text: paths[i], url: url + '/1/'})
  }
  for (let i = 0; i < crumbs.length; i++) {
    crumbs[i].url = model.encodeUrl(crumbs[i].url)
  }
  rootPath = rootPath + '/1/'
  return {rootPath, crumbs}
}

function getSiteConfig() {
  const conf = config.getSiteConfig()

  if (conf.siteName === undefined || conf.siteName == null || conf.siteName === '') {
    conf.siteName = 'blog-vue'
  }
  if (conf.siteHost === undefined || conf.siteHost == null || conf.siteHost === '') {
    conf.siteHost = 'http://127.0.0.1'
  }
  if (conf.basePath === undefined || conf.basePath == null || conf.basePath === '') {
    conf.basePath = '/'
  }
  for (let i = 0; i < conf.navs.length; i++) {
    if (util.startWith(conf.navs[i].url, conf.basePath)) {
      continue
    }
    conf.navs[i].url = path.join(conf.basePath, conf.navs[i].url)
  }
  if (conf.pageSize === undefined || conf.pageSize == null || conf.pageSize === '' || conf.pageSize <= 0) {
    conf.pageSize = 10
  }
  if (conf.urlReplace === undefined || conf.urlReplace == null) {
    conf.urlReplace = {}
  }
  if (conf.backgroundImage === undefined || conf.backgroundImage == null) {
    conf.backgroundImage = {}
  }
  return conf
}

function getHomeConfig() {
  const conf = config.getHomeConfig()

  if (conf.brandInterval === undefined || conf.brandInterval == null || conf.brandInterval === '' || conf.brandInterval <= 0) {
    conf.pageSize = 10000
  }
  if (conf.brands === undefined || conf.brands == null) {
    conf.brands = []
  }
  if (conf.navs === undefined || conf.navs == null) {
    conf.navs = []
  }

  return conf
}

function getPageFootConfig() {
  const conf = config.getPageFootConfig()

  if (conf.lines === undefined || conf.lines == null) {
    conf.lines = []
  }

  return conf
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
    if (route === undefined || route == null || route === '') {
      continue
    }
    route = model.encodeUrl(route)
    routes.push(route)
  }

  // const siteConfig = getSiteConfig()
  // if (util.contain(siteConfig.siteHost, 'cellargalaxy.github.io') && util.contain(siteConfig.basePath, 'blog-vue')) {
  //   routes.push('/view/标题_markdown') //todo
  // }

  return routes
}

function listSortRoute(files, sort) {
  let count = 0
  for (let i = 0; i < files.length; i++) {
    if (util.startWith(files[i].dir, sort)) {
      count++
    }
  }
  const pageSize = getSiteConfig().pageSize
  let page = count / pageSize
  if (count % pageSize > 0) {
    page++
  }
  const routes = []
  for (let i = 1; i <= page; i++) {
    let url = path.join('/page', sort, i + '')
    routes.push(url)
  }
  return routes
}

export default {
  initPath: initPath,
  parsePath: parsePath,
  content2Files: content2Files,
  page: page,
  listCrumb: listCrumb,
  getSiteConfig: getSiteConfig,
  getHomeConfig: getHomeConfig,
  getPageFootConfig: getPageFootConfig,
  listRoute: listRoute,
}

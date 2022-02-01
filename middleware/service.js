import util from "./util";
import model from "./model";

function parsePath(path) {
  let url = path //-> a/b/1/
  if (util.endWith(url, '/')) {
    url = url.substring(0, url.length - 1) //-> a/b/1
  }
  let index = url.lastIndexOf("/")
  let folderPath = url.substring(0, index)//-> a/b
  let currentPage = url.substring(index + 1, url.length)//-> 1
  return {folderPath, currentPage}
}

function initContents(contents) {
  if (!contents instanceof Array) {
    contents = [contents]
  }
  let copies = []
  for (let i = 0; i < contents.length; i++) {
    if (contents[i].path === '/config' && contents[i].extension === '.json') {
      continue
    }
    copies.push(contents[i])
  }
  return copies
}

function setBasePaths(contents, basePath) {
  basePath += '/article'
  return model.setBasePaths(contents, basePath)
}

function page(list, currentPage, pageSize) {
  const skipNum = (currentPage - 1) * pageSize
  const page = (skipNum + pageSize >= list.length) ? list.slice(skipNum, list.length) : list.slice(skipNum, skipNum + pageSize)
  return page
}

export default {
  parsePath: parsePath,
  initContents: initContents,
  setBasePaths: setBasePaths,
  page: page,
}

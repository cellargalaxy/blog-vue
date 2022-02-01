import util from "./util";
import model from "./model";

function initPath(path) {
  //-> a/b/1/
  if (util.endWith(path, '/')) {
    path = path.substring(0, path.length - 1) //-> a/b/1
  }
  return path
}

function parsePath(path) {
  path = initPath(path)
  let index = path.lastIndexOf("/")
  let folderPath = path.substring(0, index)//-> a/b
  let currentPage = path.substring(index + 1, path.length)//-> 1
  currentPage = util.string2Int(currentPage)
  return {folderPath, currentPage}
}

function initContents(contents, basePath) {
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
  copies = model.setBasePaths(copies, basePath)
  return copies
}

function page(list, currentPage, pageSize) {
  const skipNum = (currentPage - 1) * pageSize
  const page = (skipNum + pageSize >= list.length) ? list.slice(skipNum, list.length) : list.slice(skipNum, skipNum + pageSize)
  return page
}

export default {
  initPath: initPath,
  parsePath: parsePath,
  initContents: initContents,
  page: page,
}

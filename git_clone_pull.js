const git = require("isomorphic-git")
const path = require('path')
const fs = require('fs-extra')

const config = require('./middleware/config')

const logger = {
  info: function (string, ...infos) {
    log('info', 'git_clone', formatString(string, ...infos))
  },
  error: function (string, ...infos) {
    log('error', 'git_clone', formatString(string, ...infos))
  },
}

const repositoryPath = config.repositoryPath
logger.info('仓库路径: {}', repositoryPath)

const gitUrl = process.env.GIT_URL
logger.info('gitUrl: {}', '***' + gitUrl.split('/')[gitUrl.split('/').length - 1])

const ref = process.env.GIT_REF ? process.env.GIT_REF : 'master'
logger.info('git分支: {}', ref)

const username = process.env.GIT_USERNAME ? process.env.GIT_USERNAME : ''
const password = process.env.GIT_PASSWORD ? process.env.GIT_PASSWORD : ''

const staticFileDataPath = 'staticFileData.json'

if (process.argv.length < 3) {
  logger.error('未输入命令类型:clone,pull')
} else if (process.argv[2] == 'clone') {
  clone()
} else if (process.argv[2] == 'pull') {
  pull()
} else if (process.argv[2] == 'copyStatusFile') {
  copyStatusFile()
} else if (process.argv[2] == 'removeStatusFile') {
  removeStatusFile()
} else if (process.argv[2] == 'copy') {
  copy(process.argv[3], process.argv[4])
} else if (process.argv[2] == 'remove') {
  remove(process.argv[3])
} else {
  logger.error('非法命令类型: {}', process.argv[2])
}

async function clone() {
  logger.info('删除仓库目录')
  fs.removeSync(repositoryPath)

  logger.info('开始clone仓库')
  await git.clone({
    'fs': fs,
    'dir': repositoryPath,
    'url': gitUrl,
    'ref': ref,
    'username': username,
    'password': password,
    'singleBranch': true,
    'depth': 1,
  })
  logger.info('完成clone仓库')
}

async function pull() {
  logger.info('开始pull仓库')
  await git.pull({
    'fs': fs,
    'dir': repositoryPath,
    'ref': ref,
    'username': username,
    'password': password,
    'singleBranch': true,
  })
  logger.info('完成pull仓库')
}

function removeStatusFile() {
  logger.info('开始删除静态文件')
  const files = fs.readJsonSync(staticFileDataPath)
  if (!files || files.length == 0) {
    logger.info('没有静态文件需要被删除')
    return
  }
  for (let i = 0; i < files.length; i++) {
    const fileOrFolderPath = join('static', files[i])
    logger.info('删除静态文件: {}', fileOrFolderPath)
    fs.removeSync(fileOrFolderPath)
  }
  logger.info('完成删除静态文件')
}

function copyStatusFile() {
  logger.info('开始复制静态文件')
  const staticFolderPath = join(repositoryPath, '.static')
  if (!isFolder(staticFolderPath)) {
    logger.info('静态文件文件夹不存在')
    return
  }
  const files = fs.readdirSync(staticFolderPath)
  fs.outputJsonSync(staticFileDataPath, files)
  for (let i = 0; i < files.length; i++) {
    const fileOrFolderPath = join(staticFolderPath, files[i])
    logger.info('复制静态文件: {}', fileOrFolderPath)
    fs.copySync(fileOrFolderPath, join('static', files[i]))
  }
  logger.info('完成复制静态文件')
}

function copy(sourcePath, targetPath) {
  fs.copySync(sourcePath, targetPath)
}

function remove(targetPath) {
  if (isFolder(targetPath)) {
    const files = fs.readdirSync(targetPath)
    for (let i = 0; i < files.length; i++) {
      fs.removeSync(join(targetPath, files[i]))
    }
  } else {
    fs.removeSync(targetPath)
  }
}

function exists(fileOrFolderPath) {
  try {
    fs.accessSync(fileOrFolderPath, fs.constants.F_OK)
    return true
  } catch (err) {
    return false
  }
}

function isFolder(folderPath) {
  try {
    return exists(folderPath) && fs.statSync(folderPath).isDirectory()
  } catch (err) {
    return false
  }
}

function join(...paths) {
  return path.join(...paths).replace(/\\/g, '/')
}

function formatString(string, ...infos) {
  for (let i = 0; i < infos.length; i++) {
    string = string.replace('{}', infos[i])
  }
  return string
}

function log(level, name, massage) {
  console.log(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss') + ' ' + level + ' ' + name + ' ' + massage)
}

function formatDate(date, fmt) {
  let o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
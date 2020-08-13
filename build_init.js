const git = require("isomorphic-git")
const path = require('path')
const fs = require('fs-extra')
const httpRequest = require('request')

const global_config = require('./global_config')

const logger = createLogger('build_init')

const repositoryPath = global_config.repositoryPath
logger.info('仓库路径: {}', repositoryPath)

const configFilePath = join(repositoryPath, global_config.configFileName)
logger.info('配置文件路径: {}', configFilePath)

const staticFolderPath = join(repositoryPath, global_config.staticFolderName)
logger.info('git静态文件夹路径: {}', staticFolderPath)

const staticFileDataPath = global_config.staticFileDataPath
logger.info('静态文件复制列表文件: {}', staticFileDataPath)

const faviconPath = join('static', global_config.faviconPath)
logger.info('网站图标保存路径: {}', faviconPath)

const avatarPath = join('static', global_config.avatarPath)
logger.info('头像保存路径: {}', avatarPath)

const gitUrl = process.env.GIT_URL ? process.env.GIT_URL : ''
logger.info('gitUrl: {}', '***/' + gitUrl.split('/')[gitUrl.split('/').length - 1])

const ref = process.env.GIT_REF ? process.env.GIT_REF : 'master'
logger.info('git分支: {}', ref)

const username = process.env.GIT_USERNAME ? process.env.GIT_USERNAME : ''
const password = process.env.GIT_PASSWORD ? process.env.GIT_PASSWORD : ''

if (process.argv.length < 3) {
  logger.error('未输入命令类型:clone,pull,copyStatusFile,removeStatusFile,downloadStatic,copyConfigFile')
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
} else if (process.argv[2] == 'downloadStatic') {
  downloadStatic()
} else if (process.argv[2] == 'copyConfigFile') {
  copyConfigFile()
} else {
  logger.error('非法命令类型: {}', process.argv[2])
}

function downloadStatic() {
  const config = fs.readJsonSync(configFilePath)
  if (config == null || config.site == null) {
    logger.warn('配置文件没有siteConfig')
    return
  }
  const avatarUrl = config.site.avatarUrl
  if (avatarUrl == null || avatarUrl == '') {
    logger.warn('配置文件没有头像URL')
  } else {
    download(avatarUrl, avatarPath)
  }
  const faviconUrl = config.site.faviconUrl
  if (faviconUrl == null || faviconUrl == '') {
    logger.warn('配置文件没有网站图标URL')
  } else {
    download(faviconUrl, faviconPath)
  }
}

function download(url, filePath) {
  httpRequest.head(url, function (err, res, body) {
    if (!~[200, 304].indexOf(res.statusCode)) {
      logger.error('下载文件的状态码非法,statusCode: {}, avatarUrl:{}', res.statusCode, url)
      return
    }
    logger.info('下载文件: {}', url)
    httpRequest(url).pipe(fs.createWriteStream(filePath))
  })
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
  const filePaths = fs.readJsonSync(staticFileDataPath)
  if (!filePaths || filePaths.length == 0) {
    logger.info('没有静态文件需要被删除')
    return
  }
  for (let i = 0; i < filePaths.length; i++) {
    logger.info('开始删除静态文件: {}', filePaths[i])
    fs.removeSync(filePaths[i])
    logger.info('完成删除静态文件: {}', filePaths[i])
  }
  logger.info('完成删除静态文件')
}

function copyStatusFile() {
  logger.info('开始复制静态文件')
  if (!isFolder(staticFolderPath)) {
    logger.warn('静态文件文件夹不存在或者不是文件夹')
    return
  }
  const staticFilePaths = []
  const filePaths = listAllFilePath(staticFolderPath)
  for (let i = 0; i < filePaths.length; i++) {
    let targetStaticPath = filePaths[i].split(staticFolderPath)
    targetStaticPath = targetStaticPath[targetStaticPath.length - 1]
    targetStaticPath = join('static', targetStaticPath)
    logger.info('创建静态文件目标路径,targetStaticPath: {}', targetStaticPath)
    staticFilePaths.push(targetStaticPath)
    logger.info('开始复制静态文件: {}', targetStaticPath)
    fs.copySync(filePaths[i], targetStaticPath)
    logger.info('完成复制静态文件: {}', targetStaticPath)
  }
  fs.outputJsonSync(staticFileDataPath, staticFilePaths)
  logger.info('完成复制静态文件')
}

function listAllFilePath(folderPath) {
  if (isFolder(folderPath)) {
    const filePaths = []
    const files = fs.readdirSync(folderPath)
    for (let i = 0; i < files.length; i++) {
      const paths = listAllFilePath(join(folderPath, files[i]))
      for (let i = 0; i < paths.length; i++) {
        filePaths.push(paths[i])
      }
    }
    return filePaths
  }
  return [folderPath]
}

function copyConfigFile() {
  copy(configFilePath, 'middleware/config.json')
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

function join(...paths) {
  return path.join(...paths).replace(/\\/g, '/')
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

function createLogger(name) {
  return {
    name: name,
    trace: function (string, ...infos) {
      log('trace', name, formatString(string, ...infos))
    },
    debug: function debug(string, ...infos) {
      log('debug', name, formatString(string, ...infos))
    },
    info: function (string, ...infos) {
      log('info', name, formatString(string, ...infos))
    },
    warn: function (string, ...infos) {
      log('warn', name, formatString(string, ...infos))
    },
    error: function (string, ...infos) {
      log('error', name, formatString(string, ...infos))
    },
    fatal: function (string, ...infos) {
      log('fatal', name, formatString(string, ...infos))
    }
  }
}

function log(level, name, massage) {
  console.log(formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') + ' ' + level + ' ' + name + ' ' + massage)
}

function formatString(string, ...infos) {
  for (let i = 0; i < infos.length; i++) {
    string = string.replace('{}', infos[i])
  }
  return string
}

function formatDate(date, fmt) {
  let o = {
    'M+': date.getMonth() + 1, //月份
    'D+': date.getDate(), //日
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
const git = require("isomorphic-git")
const fs = require('fs')
const path = require('path')

const bootConfig = require('./bootConfig')

const logger = {
  info: function (string, ...infos) {
    log('info', 'articleClone', formatString(string, ...infos))
  },
  error: function (string, ...infos) {
    log('error', 'articleClone', formatString(string, ...infos))
  },
}

const repositoryPath = 'static/repository'
logger.info('仓库路径: {}', repositoryPath)

const gitUrl = process.env.BLOG_VUE_GIT_URL != undefined ? process.env.BLOG_VUE_GIT_URL : bootConfig.gitUrl
logger.info('gitUrl: {}', gitUrl)

const ref = process.env.BLOG_VUE_REF != undefined ? process.env.BLOG_VUE_REF : bootConfig.ref
logger.info('git分支: {}', ref)

const flushTime = process.env.BLOG_VUE_FLUSH_TIME != undefined ? process.env.BLOG_VUE_FLUSH_TIME : bootConfig.flushTime
logger.info('git刷新时间（毫秒）: {}', flushTime)

autoPullRepository(process.argv[2] != undefined && process.argv[2] != null ? JSON.parse(process.argv[2]) : false)

function autoPullRepository(auto) {
  try {
    logger.info('是否自动更新: {}', auto)
    if (fs.existsSync(repositoryPath)) {
      pullRepository(auto)
    } else {
      cloneRepository(auto)
    }
  } catch (e) {
    logger.error('检查仓库发生异常: {}', e)
    setTimeoutCloneRepository(auto)
  }
}

function cloneRepository(auto) {
  try {
    logger.info('删除仓库目录')
    deleteFileOrFolder(repositoryPath)

    logger.info('开始克隆仓库')
    git.clone({
      'fs': fs,
      'dir': repositoryPath,
      'url': gitUrl,
      'ref': ref,
      'singleBranch': true,
      'depth': 1,
    }).then(function () {
      logger.info('成功克隆仓库')
      setTimeoutPullRepository(auto)
    }).catch(function (e) {
      logger.error('调用克隆仓库发生异常: {}', e)
      setTimeoutCloneRepository(auto)
    })
  } catch (e) {
    logger.error('克隆仓库发生异常: {}', e)
    setTimeoutCloneRepository(auto)
  }
}

function pullRepository(auto) {
  try {
    logger.info('开始更新仓库')
    git.pull({
      'fs': fs,
      'dir': repositoryPath,
      'ref': ref,
      'singleBranch': true,
    }).then(function () {
      logger.info('成功更新仓库')
      setTimeoutPullRepository(auto)
    }).catch(function (e) {
      logger.error('调用仓库更新发生异常: {}', e)
      setTimeoutCloneRepository(auto)
    })
  } catch (e) {
    logger.error('仓库更新发生异常: {}', e)
    setTimeoutCloneRepository(auto)
  }
}

function setTimeoutPullRepository(auto) {
  if (auto) {
    logger.info('setTimeout调用pullRepository')
    setTimeout(function () {
      pullRepository(auto)
    }, flushTime)
  }
}

function setTimeoutCloneRepository(auto) {
  if (auto) {
    logger.info('setTimeout调用cloneRepository')
    setTimeout(function () {
      cloneRepository(auto)
    }, flushTime)
  }
}

function deleteFileOrFolder(fileOrFolderPath) {
  if (!fileOrFolderPath || !fs.existsSync(fileOrFolderPath)) {
    return
  }
  const stats = fs.statSync(fileOrFolderPath)
  if (stats.isFile()) {
    fs.unlinkSync(fileOrFolderPath)
    return
  }
  const files = fs.readdirSync(fileOrFolderPath)
  for (let i = 0; i < files.length; i++) {
    deleteFileOrFolder(path.join(fileOrFolderPath, files[i]))
  }
  fs.rmdirSync(fileOrFolderPath)
}

//日期对象格式化
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

function formatString(string, ...infos) {
  for (let i = 0; i < infos.length; i++) {
    string = string.replace('{}', infos[i])
  }
  return string
}

function log(level, name, massage) {
  console.log(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss') + ' ' + level + ' ' + name + ' ' + massage)
}
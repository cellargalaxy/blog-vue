const git = require("isomorphic-git")
const fs = require('fs-extra')
const path = require('path')

const config = require('./assets/config')
const bootConfig = require('./bootConfig')

const logger = {
  info: function (string, ...infos) {
    log('info', 'articleClone', formatString(string, ...infos))
  },
  error: function (string, ...infos) {
    log('error', 'articleClone', formatString(string, ...infos))
  },
}

const repositoryPath = config.repositoryPath
logger.info('仓库路径: {}', repositoryPath)

const gitUrl = process.env.BLOG_VUE_GIT_URL ? process.env.BLOG_VUE_GIT_URL : bootConfig.gitUrl
logger.info('gitUrl: {}', '***' + gitUrl.split('/')[gitUrl.split('/').length - 1])

const ref = process.env.BLOG_VUE_GIT_REF ? process.env.BLOG_VUE_GIT_REF : bootConfig.ref
logger.info('git分支: {}', ref)

const username = process.env.BLOG_VUE_GIT_USERNAME ? process.env.BLOG_VUE_GIT_USERNAME : bootConfig.username
const password = process.env.BLOG_VUE_GIT_PASSWORD ? process.env.BLOG_VUE_GIT_PASSWORD : bootConfig.password

flushRepository()

function flushRepository() {
  if (fs.pathExistsSync(repositoryPath)) {
    pullRepository()
  } else {
    cloneRepository()
  }
}

function cloneRepository() {
  logger.info('删除仓库目录')
  fs.removeSync(repositoryPath)

  logger.info('开始克隆仓库')
  git.clone({
    'fs': fs,
    'dir': repositoryPath,
    'url': gitUrl,
    'ref': ref,
    'username': username,
    'password': password,
    'singleBranch': true,
    'depth': 1,
  }).then(() => {
    logger.info('成功克隆仓库')
    moveConfigToStatus()
  }).catch((e) => {
    logger.error('调用克隆仓库发生异常: {}', e)
  })
}

function pullRepository() {
  logger.info('开始更新仓库')
  git.pull({
    'fs': fs,
    'dir': repositoryPath,
    'ref': ref,
    'username': username,
    'password': password,
    'singleBranch': true,
  }).then(() => {
    logger.info('成功更新仓库')
    moveConfigToStatus()
  }).catch((e) => {
    logger.error('调用仓库更新发生异常: {}', e)
    cloneRepository()
  })
}

function moveConfigToStatus() {
  const configPath = join(repositoryPath, '.config')
  if (!fs.pathExistsSync(configPath)) {
    return
  }
  logger.info('复制config文件到static')
  fs.copySync(configPath, 'static')
}

function join(...paths) {
  return path.join(...paths).replace(/\\/g, '/')
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
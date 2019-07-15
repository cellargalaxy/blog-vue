const git = require("isomorphic-git")
const fs = require('fs')
const path = require('path')

let gitUrl = 'https://github.com/cellargalaxy/blog.git'
let ref = 'master'
let repositoryPath = 'repository'
let basePath = ''
let repositoryBasePath = path.join(repositoryPath, basePath)
let pullTime = 1000 * 60 * 10

autoPullRepository()

function cloneRepository() {
  try {
    flushGitConfig()
    info('删除仓库目录')
    deleteFileOrFolder(repositoryPath)

    info('开始克隆仓库')
    git.clone({
      'fs': fs,
      'dir': repositoryPath,
      'url': gitUrl,
      'ref': ref,
      'singleBranch': true,
      'depth': 1,
    }).then(function () {
      info('成功克隆仓库')
      info('setTimeout调用pullRepository')
      setTimeout(pullRepository, pullTime)
    }).catch(function (e) {
      error('调用克隆仓库发生异常: {}', e)
      info('setTimeout调用cloneRepository')
      setTimeout(cloneRepository, pullTime)
    })
  } catch (e) {
    error('克隆仓库发生异常: {}', e)
    info('setTimeout调用cloneRepository')
    setTimeout(cloneRepository, pullTime)
  }
}

function pullRepository() {
  try {
    flushGitConfig()
    info('开始更新仓库')
    git.pull({
      'fs': fs,
      'dir': repositoryPath,
      'ref': ref,
      'singleBranch': true,
    }).then(function () {
      info('成功更新仓库')
      info('setTimeout调用pullRepository')
      setTimeout(pullRepository, pullTime)
    }).catch(function (e) {
      error('调用仓库更新发生异常: {}', e)
      info('setTimeout调用cloneRepository')
      setTimeout(cloneRepository, pullTime)
    })
  } catch (e) {
    error('仓库更新发生异常: {}', e)
    info('setTimeout调用cloneRepository')
    setTimeout(cloneRepository, pullTime)
  }
}

function autoPullRepository() {
  try {
    if (fs.existsSync(repositoryPath)) {
      pullRepository(repositoryPath, ref, pullTime)
    } else {
      cloneRepository(repositoryPath, gitUrl, ref, pullTime)
    }
  } catch (e) {
    error('检查仓库发生异常: {}', e)
    info('setTimeout调用cloneRepository')
    setTimeout(cloneRepository, pullTime)
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

function getConfig() {
  try {
    const configPath = path.join(repositoryBasePath, '.config', 'config.json')
    if (!fs.existsSync(configPath)) {
      return null
    }
    const stats = fs.statSync(configPath)
    if (stats.isFile()) {
      const data = fs.readFileSync(configPath)
      return JSON.parse(data)
    }
  } catch (e) {
    error('读取配置文件发生异常: {}', e)
  }
  return null
}

function getGitConfig() {
  const config = getConfig(repositoryBasePath)
  if (config && config.gitConfig) {
    return config.gitConfig
  }
  return null
}

function flushGitConfig() {
  const gitConfig = getGitConfig()
  if (!gitConfig) {
    return
  }
  if (gitConfig.gitUrl) {
    gitUrl = gitConfig.gitUrl
  }
  if (gitConfig.ref) {
    ref = gitConfig.ref
  }
  if (gitConfig.repositoryPath) {
    repositoryPath = gitConfig.repositoryPath
  }
  if (gitConfig.basePath) {
    basePath = gitConfig.basePath
  }
  if (gitConfig.pullTime) {
    pullTime = gitConfig.pullTime
  }
  repositoryBasePath = path.join(repositoryPath, basePath)

  info('git仓库地址: {}', gitUrl)
  info('git仓库分支: {}', ref)
  info('仓库路径: {}', repositoryPath)
  info('仓库基础路径: {}', basePath)
  info('仓库完整基础路径: {}, 即: {}', repositoryBasePath, path.join(path.resolve(), repositoryBasePath))
  info('文章缓存时间: {}', pullTime)
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

function info(string, ...infos) {
  console.log(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss') + ' info ' + formatString(string, ...infos))
}

function error(string, ...infos) {
  console.log(formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss') + ' error ' + formatString(string, ...infos))
}
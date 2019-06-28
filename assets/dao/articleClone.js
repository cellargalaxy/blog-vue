const git = require("isomorphic-git")
const fs = require('fs')
const path = require('path')

import log from '../utils/log'
import fileIo from '../utils/fileIo'
import configService from '../service/configService'

const gitUrl = configService.getGitConfig().gitUrl
log.info('git仓库地址: {}', gitUrl)

const ref = configService.getGitConfig().ref
log.info('git仓库分支: {}', ref)

const repositoryMainPath = configService.getGitConfig().repositoryMainPath
log.info('主仓库路径: {}, 即: {}', repositoryMainPath, path.join(path.resolve(), repositoryMainPath))

const pullTime = configService.getGitConfig().pullTime
log.info('文章缓存时间: {}', pullTime)

function cloneRepository() {
  try {
    log.info('删除仓库目录')
    fileIo.deleteFileOrFolder(repositoryMainPath)

    log.info('开始克隆仓库')
    git.clone({
      'fs': fs,
      'dir': repositoryMainPath,
      'url': gitUrl,
      'ref': ref,
      'singleBranch': true,
      'depth': 1,
    }).then(function () {
      log.info('成功克隆仓库')
      log.info('setTimeout调用pullRepository')
      setTimeout(pullRepository, pullTime)
    }).catch(function (e) {
      log.error('调用克隆仓库发生异常: {}', e)
      log.info('setTimeout调用cloneRepository')
      setTimeout(cloneRepository, pullTime)
    })
  } catch (e) {
    log.error('克隆仓库发生异常: {}', e)
    log.info('setTimeout调用cloneRepository')
    setTimeout(cloneRepository, pullTime)
  }
}

function pullRepository() {
  try {
    log.info('开始更新仓库')
    git.pull({
      'fs': fs,
      'dir': repositoryMainPath,
      'ref': ref,
      'singleBranch': true,
    }).then(function () {
      log.info('成功更新仓库')
      log.info('setTimeout调用pullRepository')
      setTimeout(pullRepository, pullTime)
    }).catch(function (e) {
      log.error('调用仓库更新发生异常: {}', e)
      log.info('setTimeout调用cloneRepository')
      setTimeout(cloneRepository, pullTime)
    })
  } catch (e) {
    log.error('仓库更新发生异常: {}', e)
    log.info('setTimeout调用cloneRepository')
    setTimeout(cloneRepository, pullTime)
  }
}

function autoPullRepository() {
  try {
    if (fs.existsSync(repositoryMainPath)) {
      pullRepository()
    } else {
      cloneRepository()
    }
  } catch (e) {
    log.error('检查仓库发生异常: {}', e)
    log.info('setTimeout调用cloneRepository')
    setTimeout(cloneRepository, pullTime)
  }
}

export default {
  autoPullRepository: autoPullRepository,
}

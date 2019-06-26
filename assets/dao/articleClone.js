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

const repositoryTmpPath = configService.getGitConfig().repositoryTmpPath
log.info('临时仓库路径: {}, 即: {}', repositoryTmpPath, path.join(path.resolve(), repositoryTmpPath))

const pullTime = configService.getGitConfig().pullTime
log.info('文章缓存时间: {}', pullTime)

function cloneRepository() {
  log.info('开始克隆仓库')

  log.info('删除临时仓库目录: {}', repositoryTmpPath)
  fileIo.deleteFileOrFolder(repositoryTmpPath)

  git.clone({
    'fs': fs,
    'dir': repositoryTmpPath,
    'url': gitUrl,
    'ref': ref,
    'singleBranch': true,
    'depth': 1,
  }).then(function () {
    try {
      log.info('成功克隆仓库')

      log.info('删除主仓库目录')
      fileIo.deleteFileOrFolder(repositoryMainPath)

      log.info('重命名临时仓库目录为主仓库目录')
      fs.renameSync(repositoryTmpPath, repositoryMainPath)
    } catch (e) {
      log.error('仓库迁移发生异常: {}', e)
    } finally {
      log.info('setTimeout调用autoCloneRepository')
      setTimeout(autoCloneRepository, pullTime)
    }
  }).catch(function (e) {
    log.error('调用克隆仓库发生异常: {}', e)
    log.info('setTimeout调用autoCloneRepository')
    setTimeout(autoCloneRepository, pullTime)
  })
}

function autoCloneRepository() {
  try {
    cloneRepository()
  } catch (e) {
    log.error('克隆仓库发生异常: {}', e)
    log.info('setTimeout调用autoCloneRepository')
    setTimeout(autoCloneRepository, pullTime)
  }
}

export default {
  autoCloneRepository: autoCloneRepository,
}

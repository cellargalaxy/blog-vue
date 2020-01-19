import fs from 'fs'

import config from '../../config'
import log from '../utils/log'
import utils from '../utils/utils'
import fileIO from '../utils/fileIO'

const logger = log('articleDao')
const repositoryPath = config.repositoryPath

function getMarkdown(articlePath) {
  const baseArticlePath = fileIO.join(repositoryPath, articlePath)
  logger.info('创建baseArticlePath: {}', baseArticlePath)
  if (!utils.startsWith(baseArticlePath, repositoryPath)) {
    logger.error('读取文章文件路径不在仓库里')
    return null
  }
  if (!fileIO.isFile(baseArticlePath)) {
    logger.error('所读取的文章文件不存在或者不是文件')
    return null
  }
  const data = fs.readFileSync(baseArticlePath)
  const markdown = data.toString()
  return markdown
}

function listFileMarkdown(folderPath, dateRegularObject, extension) {
  //{'baseArticlePath': 'markdown'}
  let fileMarkdown = {}

  const baseFolderPath = fileIO.join(repositoryPath, folderPath)
  logger.info('创建baseFolderPath: {}', baseFolderPath)
  if (!utils.startsWith(baseFolderPath, repositoryPath)) {
    logger.error('读取文章文件夹路径不在仓库里')
    return fileMarkdown
  }

  const isfile=fileIO.isFile(baseFolderPath)
  const isend=utils.endsWith(baseFolderPath, extension)
  if (isfile && isend) {
    const data = fs.readFileSync(baseFolderPath)
    const markdown = data.toString()
    fileMarkdown[folderPath] = markdown
    return fileMarkdown
  }

  if (fileIO.isFolder(baseFolderPath)) {
    const files = fs.readdirSync(baseFolderPath)
    for (let i = 0; i < files.length; i++) {
      if (utils.startsWith(files[i], '.')) {
        continue
      }
      const childFolderPath = fileIO.join(folderPath, files[i])
      logger.info('创建childFolderPath: {}', childFolderPath)
      const childFileMarkdown = listFileMarkdown(childFolderPath, dateRegularObject,extension)
      for (const childBaseArticlePath in childFileMarkdown) {
        fileMarkdown[childBaseArticlePath] = childFileMarkdown[childBaseArticlePath]
      }
    }
    return fileMarkdown
  }

  logger.error('未知类型路径baseFolderPath: {}', baseFolderPath)
  return fileMarkdown
}

export default {
  getMarkdown: getMarkdown,
  listFileMarkdown: listFileMarkdown,
}

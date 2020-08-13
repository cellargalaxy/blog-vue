import fs from 'fs'

import global_config from '../../global_config'
import log from '../utils/log'
import utils from '../utils/utils'
import fileIO from '../utils/fileIO'
import path from "path"

const logger = log('fileDao')
const REPOSITORY_PATH = global_config.repositoryPath
logger.info('仓库路径: {}', REPOSITORY_PATH)

/**
 *
 * @param filePath
 * @returns {{path: *, content: string}|null}
 */
function getFileContent(filePath) {
  const baseFilePath = fileIO.join(REPOSITORY_PATH, filePath)
  logger.info('创建baseFilePath: {}', baseFilePath)
  if (!utils.startsWith(baseFilePath, REPOSITORY_PATH)) {
    logger.error('文件路径不在仓库里')
    return null
  }
  if (fileIO.isFile(baseFilePath)) {
    const data = fs.readFileSync(baseFilePath)
    const content = data.toString()
    return {path: filePath, content: content}
  }

  const fatherFilePath = path.dirname(filePath)
  const fatherBaseFilePath = fileIO.join(REPOSITORY_PATH, fatherFilePath)
  if (!utils.startsWith(fatherBaseFilePath, REPOSITORY_PATH)) {
    logger.error('父文件路径不在仓库里')
    return null
  }
  if (!fileIO.isFolder(fatherBaseFilePath)) {
    logger.error('父文件路径不是文件夹')
    return null
  }
  const extension = path.extname(filePath)
  const subFilename = path.basename(filePath, extension)
  const files = fs.readdirSync(fatherBaseFilePath)
  for (let i = 0; i < files.length; i++) {
    const filename = files[i]
    if (utils.startsWith(filename, subFilename) && utils.endsWith(filename, extension)) {
      const filePath = fileIO.join(fatherFilePath, filename)
      const baseFilePath = fileIO.join(REPOSITORY_PATH, filePath)
      const data = fs.readFileSync(baseFilePath)
      const content = data.toString()
      return {path: filePath, content: content}
    }
  }

  return getFileContentFromAllFile('', subFilename, extension)
}

function getFileContentFromAllFile(folderPath, subFilename, extension) {
  const baseFolderPath = fileIO.join(REPOSITORY_PATH, folderPath)
  logger.info('创建baseFolderPath: {}', baseFolderPath)
  if (!utils.startsWith(baseFolderPath, REPOSITORY_PATH)) {
    logger.error('读取文件夹路径不在仓库里')
    return null
  }

  const filename = path.basename(baseFolderPath)
  if (utils.startsWith(filename, '.')) {
    return null
  }

  if (fileIO.isFile(baseFolderPath) && utils.startsWith(filename, subFilename) && utils.endsWith(filename, extension)) {
    const data = fs.readFileSync(baseFolderPath)
    const content = data.toString()
    return {path: folderPath, content: content}
  }

  if (fileIO.isFolder(baseFolderPath)) {
    const files = fs.readdirSync(baseFolderPath)
    for (let i = 0; i < files.length; i++) {
      const childFolderPath = fileIO.join(folderPath, files[i])
      logger.info('创建childFolderPath: {}', childFolderPath)
      const fileContent = getFileContentFromAllFile(childFolderPath, subFilename, extension)
      if (fileContent != null) {
        return fileContent
      }
    }
  }

  logger.error('未知类型路径baseFolderPath: {}', baseFolderPath)
  return null
}

/**
 * 递归获取文件夹下的全部文件的文本内容
 * @param folderPath
 * @param extension
 * @returns {'filePath': 'markdown'}
 */
function getFolderContent(folderPath, extension) {
  //{'filePath': 'markdown'}
  let folderContent = {}

  const baseFolderPath = fileIO.join(REPOSITORY_PATH, folderPath)
  logger.info('创建baseFolderPath: {}', baseFolderPath)
  if (!utils.startsWith(baseFolderPath, REPOSITORY_PATH)) {
    logger.error('读取文件夹路径不在仓库里')
    return folderContent
  }

  const filename = path.basename(baseFolderPath)
  if (utils.startsWith(filename, '.')) {
    return folderContent
  }

  const isFile = fileIO.isFile(baseFolderPath)
  const isEnd = utils.endsWith(baseFolderPath, extension)
  if (isFile) {
    if (isEnd) {
      const data = fs.readFileSync(baseFolderPath)
      const markdown = data.toString()
      folderContent[folderPath] = markdown
    }
    return folderContent
  }

  if (fileIO.isFolder(baseFolderPath)) {
    const files = fs.readdirSync(baseFolderPath)
    for (let i = 0; i < files.length; i++) {
      const childFolderPath = fileIO.join(folderPath, files[i])
      logger.info('创建childFolderPath: {}', childFolderPath)
      const childFileMarkdown = getFolderContent(childFolderPath, extension)
      for (const childFilePath in childFileMarkdown) {
        folderContent[childFilePath] = childFileMarkdown[childFilePath]
      }
    }
    return folderContent
  }

  logger.error('未知类型路径baseFolderPath: {}', baseFolderPath)
  return folderContent
}

export default {
  getFileContent: getFileContent,
  getFolderContent: getFolderContent,
}

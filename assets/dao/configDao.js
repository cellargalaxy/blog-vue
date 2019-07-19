import path from 'path'
import fs from 'fs'

import fileIO from '../utils/fileIO'
import log from '../utils/log'

const logger = log('configDao')

const repositoryPath = 'static/repository'
logger.info('仓库路径: {}', repositoryPath)
const basePath = ''
logger.info('仓库基础路径: {}', basePath)
const repositoryBasePath = fileIO.join(repositoryPath, basePath)
logger.info('仓库完整基础路径: {}, 即: {}', repositoryBasePath, fileIO.join(path.resolve(), repositoryBasePath))

function getConfig() {
  try {
    const configPath = fileIO.join(repositoryBasePath, '.config', 'config.json')
    if (!fs.existsSync(configPath)) {
      return null
    }
    const stats = fs.statSync(configPath)
    if (stats.isFile()) {
      const data = fs.readFileSync(configPath)
      return JSON.parse(data)
    }
  } catch (e) {
    logger.error('读取配置文件发生异常: {}', e)
  }
  return null
}

export default {
  getConfig: getConfig,
}
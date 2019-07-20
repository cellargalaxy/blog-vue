import fs from 'fs'

import fileIO from '../utils/fileIO'
import log from '../utils/log'
import bootConfig from '../../bootConfig'

const logger = log('configDao')

const repositoryPath = bootConfig.repositoryPath
logger.info('仓库路径: {}', repositoryPath)

function getConfig() {
  try {
    const configPath = fileIO.join(repositoryPath, '.config', 'config.json')
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
import fs from 'fs'

import config from '../../config'
import log from '../utils/log'
import fileIO from '../utils/fileIO'

const logger = log('configDao')
const repositoryPath = config.repositoryPath
const configName = 'config.json'

function getConfig() {
  const configPath = fileIO.join(repositoryPath, configName)
  logger.info('创建配置文件路径,configPath: {}', configPath)
  if (!fileIO.isFile(configPath)) {
    logger.error('仓库配置文件不存在或者不是文件')
    return null
  }
  const data = fs.readFileSync(configPath)
  return JSON.parse(data)
}

export default {
  getConfig: getConfig,
}
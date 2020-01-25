import fs from 'fs'

import config from '../../config'
import log from '../utils/log'
import fileIO from '../utils/fileIO'

const logger = log('configDao')
const configPath = config.configPath

function getConfig() {
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
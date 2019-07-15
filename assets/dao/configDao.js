const path = require('path')
const fs = require('fs')

import log from '../utils/log'

const repositoryPath = 'repository'
log.info('仓库路径: {}', repositoryPath)
const basePath = ''
log.info('仓库基础路径: {}', basePath)
const repositoryBasePath = path.join(repositoryPath, basePath)
log.info('仓库完整基础路径: {}, 即: {}', repositoryBasePath, path.join(path.resolve(), repositoryBasePath))

function getConfig() {
  try {
    const configPath = path.join(repositoryPath, '.config', 'config.json')
    if (!fs.existsSync(configPath)) {
      return null
    }
    const stats = fs.statSync(configPath)
    if (stats.isFile()) {
      const data = fs.readFileSync(configPath)
      return JSON.parse(data)
    }
  } catch (e) {
    console.log('读取配置文件发生异常: ', e)
  }
  return null
}

export default {
  getConfig: getConfig,
}
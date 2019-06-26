const path = require('path')
const fs = require('fs')

const repositoryMainPath = 'repository'
const basePath = ''
const repositoryPath = path.join(repositoryMainPath, basePath)

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
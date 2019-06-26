const path = require('path')
const fs = require('fs-extra')

const repositoryMainPath = 'repository'
const basePath = ''
const repositoryPath = path.join(repositoryMainPath, basePath)

function getConfig() {
  const configPath = path.join(repositoryPath, '.config', 'config.json')
  if (!fs.pathExistsSync(configPath)) {
    return null
  }
  const stats = fs.statSync(configPath)
  if (stats.isFile()) {
    return fs.readJsonSync(configPath)
  }
  return null
}

export default {
  getConfig: getConfig,
}
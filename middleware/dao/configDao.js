import fs from 'fs'

import fileIO from "../utils/fileIO"
import config from "../config"

const repositoryPath = config.repositoryPath

function getConfig() {
  const configPath = fileIO.join(repositoryPath, 'config.json')
  const stats = fs.statSync(configPath)
  if (!stats.isFile()) {
    return null
  }
  const data = fs.readFileSync(configPath)
  return JSON.parse(data)
}

export default {
  getConfig: getConfig,
}
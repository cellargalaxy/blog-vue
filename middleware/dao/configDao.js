import config from '../config'
import log from '../utils/log'

const logger = log('configDao')

function getConfig() {
  return config
}

export default {
  getConfig: getConfig,
}
import config from '../content/config'
import log from './log'
import path from 'path'

const logger = log('config')

function getConfig(key) {
  try {
    if (config === undefined || config == null) {
      logger.error('读取配置文件为空')
      return {}
    }
    if (config[key]) {
      return config[key]
    }
    logger.warn('读取配置为空: {}', key)
    return {}
  } catch (e) {
    logger.error('读取配置文件异常: {}', e)
    return {}
  }
}

function getSiteConfig() {
  const config = getConfig('site')
  return config
}

function getHomeConfig() {
  const config = getConfig('home')
  return config
}

function getPageFootConfig() {
  const config = getConfig('pageFoot')
  return config
}

export default {
  getSiteConfig: getSiteConfig,
  getHomeConfig: getHomeConfig,
  getPageFootConfig: getPageFootConfig,
}

import config from '../content/config'
import log from './log'

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
    logger.warn('读取配置为空')
    return {}
  } catch (e) {
    logger.error('读取配置文件异常: {}', e)
    return {}
  }
}

function getSiteConfig() {
  return getConfig('site')
}

function getNavbarConfig() {
  return getConfig('navbar')
}

function getHomeConfig() {
  return getConfig('home')
}

function getPageFootConfig() {
  return getConfig('pageFoot')
}

export default {
  getSiteConfig: getSiteConfig,
  getNavbarConfig: getNavbarConfig,
  getHomeConfig: getHomeConfig,
  getPageFootConfig: getPageFootConfig,
}

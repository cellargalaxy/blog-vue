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

function getNavbarConfig() {
  const site = getSiteConfig()
  const config = getConfig('navbar')
  if (config.brandText === undefined || config.brandText == null || config.brandText === '') {
    config.brandText = site.siteName
  }
  if (config.brandUrl === undefined || config.brandUrl == null || config.brandUrl === '') {
    config.brandUrl = site.basePath
  }
  for (let i = 0; i < config.navs.length; i++) {
    config.navs[i].url = path.join(site.basePath, config.navs[i].url)
  }
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
  getNavbarConfig: getNavbarConfig,
  getHomeConfig: getHomeConfig,
  getPageFootConfig: getPageFootConfig,
}

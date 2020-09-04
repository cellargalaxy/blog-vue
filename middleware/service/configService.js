import log from '../utils/log'
import configDao from '../dao/configDao'
import default_config from './default_config'

const logger = log('configService')

function getConfig() {
  try {
    let config = configDao.getConfig()
    if (config == null) {
      logger.error('读取配置文件失败')
      config = default_config
    }
    return config
  } catch (e) {
    logger.error('读取配置文件失败: {}', e)
    return default_config
  }
}

function getSiteConfig() {
  const config = getConfig()
  if (config.site) {
    return config.site
  }
  return default_config.site
}

function getHomeConfig() {
  const config = getConfig()
  if (config.home) {
    return config.home
  }
  return default_config.home
}

function getNavbarConfig() {
  const config = getConfig()
  if (config.navbar) {
    return config.navbar
  }
  return default_config.navbar
}

function getFileConfig() {
  const config = getConfig()
  if (config.file) {
    return config.file
  }
  return default_config.file
}

function getPageFootConfig() {
  const config = getConfig()
  if (config.pageFoot) {
    return config.pageFoot
  }
  return default_config.pageFoot
}

function getErrorPageConfig(statusCode) {
  statusCode = statusCode + ''
  let config = getConfig()
  if (config.errorPage && config.errorPage[statusCode]) {
    return config.errorPage[statusCode]
  }
  return {
    "statusCode": statusCode,
    "message": "unknown error",
    "returnText": "go back home page",
    "returnUrl": "/"
  }
}

export default {
  getSiteConfig: getSiteConfig,
  getNavbarConfig: getNavbarConfig,
  getPageFootConfig: getPageFootConfig,
  getFileConfig: getFileConfig,
  getHomeConfig: getHomeConfig,
  getErrorPageConfig: getErrorPageConfig,
}

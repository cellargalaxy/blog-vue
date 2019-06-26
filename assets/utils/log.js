import configService from '../service/configService'

const log4js = require('log4js')
const logger = log4js.getLogger(configService.getLogConfig().name)
logger.level = configService.getLogConfig().level

function formatString(string, ...infos) {
  for (let i = 0; i < infos.length; i++) {
    string = string.replace('{}', infos[i])
  }
  return string
}

function trace(string, ...infos) {
  logger.trace(formatString(string, ...infos))
}

function debug(string, ...infos) {
  logger.debug(formatString(string, ...infos))
}

function info(string, ...infos) {
  logger.info(formatString(string, ...infos))
}

function warn(string, ...infos) {
  logger.warn(formatString(string, ...infos))
}

function error(string, ...infos) {
  logger.error(formatString(string, ...infos))
}

function fatal(string, ...infos) {
  logger.fatal(formatString(string, ...infos))
}

export default {
  trace: trace,
  debug: debug,
  info: info,
  warn: warn,
  error: error,
  fatal: fatal,
}

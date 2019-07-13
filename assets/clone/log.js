const utils = require('./utils')

// import utils from './utils'

function log(level, massage) {
  console.log(utils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss') + ' ' + level + ' ' + massage)
}

const logger = {}

logger.trace = function (massage) {
  log('trace', massage)
}
logger.debug = function (massage) {
  log('debug', massage)
}
logger.info = function (massage) {
  log('info', massage)
}
logger.warn = function (massage) {
  log('warn', massage)
}
logger.error = function (massage) {
  log('error', massage)
}
logger.fatal = function (massage) {
  log('fatal', massage)
}

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

// export default {
//   trace: trace,
//   debug: debug,
//   info: info,
//   warn: warn,
//   error: error,
//   fatal: fatal,
// }
module.exports = {
  trace: trace,
  debug: debug,
  info: info,
  warn: warn,
  error: error,
  fatal: fatal,
}
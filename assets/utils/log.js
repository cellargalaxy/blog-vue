import utils from '../utils/utils'

function log(level, name, massage) {
  console.log(utils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss') + ' ' + level + ' ' + name + ' ' + massage)
}

function formatString(string, ...infos) {
  for (let i = 0; i < infos.length; i++) {
    string = string.replace('{}', infos[i])
  }
  return string
}


export default function (name) {
  return {
    name: name,
    trace: function (string, ...infos) {
      log('trace', name, formatString(string, ...infos))
    },
    debug: function debug(string, ...infos) {
      log('debug', name, formatString(string, ...infos))
    },
    info: function (string, ...infos) {
      log('info', name, formatString(string, ...infos))
    },
    warn: function (string, ...infos) {
      log('warn', name, formatString(string, ...infos))
    },
    error: function (string, ...infos) {
      log('error', name, formatString(string, ...infos))
    },
    fatal: function (string, ...infos) {
      log('fatal', name, formatString(string, ...infos))
    }
  }
}
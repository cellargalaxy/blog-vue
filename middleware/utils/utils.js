//格式化时间戳
function formatTimestamp(timestamp, fmt) {
  return formatDate(new Date(timestamp), fmt)
}

//日期对象格式化
function formatDate(date, fmt) {
  let o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

//文件大小格式化
function formatFileSize(size) {
  if (size < 0) return 'illegal size: ' + size
  if (size == 0) return '0B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const e = Math.floor(Math.log(size) / Math.log(1024))
  return (size / Math.pow(1024, Math.floor(e))).toFixed(2) + '' + units[e]
}

//读cookie
function getCookieFromString(cookieString, name) {
  if (!cookieString) return null
  const cookies = cookieString.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const keyValue = cookies[i].split('=')
    if (keyValue[0].trim() == name) return keyValue[1].trim()
  }
  return null
}

function getCookie(name) {
  getCookieFromString(document.cookie, name)
}

function isNum(s) {
  if (s != null && s != '') {
    return !isNaN(s)
  }
  return false;
}

//写cookie
function setCookie(key, value, timeout) {
  const date = new Date()
  date.setTime(date.getTime() + timeout)
  document.cookie = key + '=' + value + '; expires=' + date.toGMTString()
}

function startsWith(string, start) {
  return string.indexOf(start) == 0
}

function endsWith(string, end) {
  return string.substring(string.length - end.length) == end
}

export default {
  formatTimestamp: formatTimestamp,
  formatDate: formatDate,
  formatFileSize: formatFileSize,
  getCookie: getCookie,
  setCookie: setCookie,
  isNum: isNum,
  startsWith: startsWith,
  endsWith: endsWith,
}
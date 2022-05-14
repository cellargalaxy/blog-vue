//格式化时间戳
function formatTimestamp(timestamp, fmt) {
  return formatDate(new Date(timestamp), fmt)
}

//日期对象格式化
function formatDate(date, fmt) {
  let o = {
    'M+': date.getMonth() + 1, //月份
    'D+': date.getDate(), //日
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    'S': date.getMilliseconds() //毫秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

function contain(string, start) {
  return string.indexOf(start) >= 0
}

function startWith(string, start) {
  return string.indexOf(start) === 0
}

function endWith(string, end) {
  return string.substring(string.length - end.length) === end
}

function hashString(string) {
  let hash = 0
  if (string === undefined || string == null || string.length === 0) {
    return hash
  }
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash
}

function randomString(n) {
  n = n || 32;
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"
  const a = t.length
  let string = ""
  for (let i = 0; i < n; i++) string += t.charAt(Math.floor(Math.random() * a))
  return string
}

function isNum(string) {
  if (string != null && string !== '') {
    return !isNaN(string)
  }
  return false
}

function string2Int(string) {
  if (!isNum(string)) {
    return 0
  }
  return parseInt(string)
}

export default {
  formatTimestamp: formatTimestamp,
  formatDate: formatDate,
  string2Int: string2Int,
  contain: contain,
  startWith: startWith,
  endWith: endWith,
  hashString: hashString,
  isNum: isNum,
  randomString: randomString,
}

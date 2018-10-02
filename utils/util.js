//import marked from 'marked'
import 'highlight.js/styles/idea.css';

const hljs = require('highlight.js');
const markdownItWithHtml = require('markdown-it')({
  html: true,        // Enable HTML tags in source
  xhtmlOut: false,        // Use '/' to close single tags (<br/>).
                          // This is only for full CommonMark compatibility.
  breaks: false,        // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
                            // useful for external highlighters.
  linkify: false,        // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {
      }
    }
    return ''; // use external default escaping
  }
});
const markdownItWithoutHtml = require('markdown-it')({
  html: false,        // Enable HTML tags in source
  xhtmlOut: false,        // Use '/' to close single tags (<br/>).
                          // This is only for full CommonMark compatibility.
  breaks: false,        // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
                            // useful for external highlighters.
  linkify: false,        // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer: false,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre... internal wrapper is skipped.
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {
      }
    }
    return ''; // use external default escaping
  }
});

function markdown2htmlWithHtml(markdown) {
  if (markdown == null) {
    return null
  }
  return markdownItWithHtml.render(markdown);
  // return marked(markdown, {sanitize: true})
}

function markdown2htmlWithoutHtml(markdown) {
  if (markdown == null) {
    return null
  }
  return markdownItWithoutHtml.render(markdown);
  // return marked(markdown, {sanitize: true})
}

//格式化时间戳
function formatTimestamp(timestamp, fmt) {
  return formatDate(new Date(timestamp), fmt)
}

//日期对象格式化
function formatDate(date, fmt) {
  var o = {
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
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

//文件大小格式化
function formatFileSize(bytes) {
  var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i]
}

//读cookie
function getCookieFromString(cookieString, name) {
  if (cookieString == null) {
    return null
  }
  var nameEQ = name + '='
  var ca = cookieString.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

function getCookie(name) {
  if (!inBrowser()) {
    return null
  }
  return getCookieFromString(document.cookie, name)
}

//写cookie
function setCookie(key, value) {
  if (inBrowser()) {
    var date = new Date()
    date.setTime(date.getTime() + (1000 * 60 * 60 * 6))
    document.cookie = key + '=' + value + '; expires=' + date.toGMTString()
  }

}

//成功信息弹框
function successInfo(info) {
  if (inBrowser()) {
    alert(info)
  }
}

//失败信息弹框
function errorInfo(info) {
  if (inBrowser()) {
    alert(info)
  }
}

function confirmBox(message) {
  if (inBrowser()) {
    return confirm(message)
  }
  return true
}

function exitWarm(message) {
  if (inBrowser()) {
    window.onbeforeunload = function () {
      return message;
    }
  }
}

function inBrowser() {
  // return true
  return typeof window !== 'undefined'
}

//检查参数并通过询问框询问
//对data检查key为parameters的数据
//数字大于0，字符串长度大于0，非数字字符串要求不为空
//要求全部parameters都符合要求
function checkParameterAnd(message, data, ...parameters) {
  if (data == null) {
    return false;
  }
  for (let i = 0; i < parameters.length; i++) {
    var parameter = parameters[i]
    if (parameter != null) {
      if (data[parameter] == null || (!isNaN(data[parameter]) && data[parameter] < 1)) {
        console.log('非法参数,' + parameter + ':' + data[parameter])
        errorInfo('非法参数,' + parameter + ':' + data[parameter])
        return false
      }
      if (isNaN(data[parameter])) {
        data[parameter] = data[parameter].trim()
        if (data[parameter].length == 0) {
          console.log('非法参数,' + parameter + ':' + data[parameter])
          errorInfo('非法参数,' + parameter + ':' + data[parameter])
          return false
        }
      }
    }
  }
  return message == null || confirmBox(message)
}

//检查参数并通过询问框询问
//对data检查key为parameters的数据
//数字大于0，字符串长度大于0，非数字字符串要求不为空
//要求至少有一个parameters符合要求
function checkParameterOr(message, data, ...parameters) {
  if (data == null) {
    return false;
  }
  for (let i = 0; i < parameters.length; i++) {
    var parameter = parameters[i]
    if (parameter != null && data[parameter] != null) {
      if (!isNaN(data[parameter]) && data[parameter] > 0) {
        return message == null || confirmBox(message)
      }
      if (isNaN(data[parameter])) {
        data[parameter] = data[parameter].trim()
        if (data[parameter].length > 0) {
          return message == null || confirmBox(message)
        }
      }
    }
  }
  console.log('无有效参数')
  console.log(parameters)
  console.log(data)
  errorInfo('无有效参数')
  return false
}

//在checkParameterAnd基础上特意检查pageSize和page
function checkQueryParameter(data, ...parameters) {
  if (data == null) {
    return false;
  }
  if (data['pageSize'] == null || isNaN(data['pageSize']) || data['pageSize'] < 1 || data['pageSize'] > 100) {
    console.log('非法参数,pageSize:' + data['pageSize'])
    errorInfo('非法参数,pageSize' + data['pageSize'])
    return false
  }
  if (data['page'] == null || isNaN(data['page']) || data['page'] < 1) {
    console.log('非法参数,page:' + data['page'])
    errorInfo('非法参数,page' + data['page'])
    return false
  }
  return checkParameterAnd(null, data, ...parameters)
}

export default {
  markdown2htmlWithHtml: markdown2htmlWithHtml,
  markdown2htmlWithoutHtml: markdown2htmlWithoutHtml,
  formatTimestamp: formatTimestamp,
  formatDate: formatDate,
  formatFileSize: formatFileSize,
  getCookieFromString: getCookieFromString,
  getCookie: getCookie,
  setCookie: setCookie,
  successInfo: successInfo,
  errorInfo: errorInfo,
  confirmBox: confirmBox,
  exitWarm: exitWarm,
  checkParameterAnd: checkParameterAnd,
  checkParameterOr: checkParameterOr,
  checkQueryParameter: checkQueryParameter,
}

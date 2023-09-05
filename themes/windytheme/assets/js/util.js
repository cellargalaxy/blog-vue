function getNowTimestamp() {
    return getTimestamp(new Date())
}

function getTimestamp(date) {
    return Math.floor(date.getTime() / 1000 )
}

function formatTimestamp(timestamp, fmt) {
    return formatDate(new Date(timestamp * 1000), fmt)
}

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

function reFormatDate(str, fmt) {
    if (isNum(str)) {
        if (str <= 0) {
            return '-'
        }
        return formatTimestamp(str, fmt)
    }
    let ts = getTimestamp(new Date(str))
    if (ts <= 0) {
        return '-'
    }
    return formatTimestamp(ts, fmt)
}

function getAddYearDate(year) {
    let before = new Date()
    before.setFullYear(before.getFullYear() + year)
    return before
}

function parse2BeijingTimestamp(date) {
    let timestamp = 0
    if (date !== undefined && date != null && date !== '') {
        timestamp = Date.parse(date + ' GMT+8') / 1000
    }
    if (!isNum(timestamp)) {
        timestamp = 0
    }
    return timestamp
}

//----------------------------------------------------------------------------------------------------------------------

function genId() {
    return formatDate(new Date(), 'YYMMDDHHmmssS') + 'web' + randomChar()
}

function randomChar() {
    let words = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    return words[Math.floor(Math.random() * words.length)]
}

function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
        return decodeURIComponent(r[2])
    }
    return null
}

function startWith(string, start) {
    return string.indexOf(start) === 0
}

function containWith(string, sub) {
    return string.indexOf(sub) >= 0
}

function isNum(s) {
    if (s != null && s !== '') {
        return !isNaN(s)
    }
    return false
}

function toString(value) {
    if (value === null || typeof value === 'undefined') {
        return ''
    } else if (value instanceof Object) {
        return Object.keys(value)
            .sort()
            .map(key => toString(value[key]))
            .join(' ')
    } else {
        return String(value)
    }
}

//----------------------------------------------------------------------------------------------------------------------

function writeClipboard(text) {
    const textarea = document.createElement('textarea')
    textarea.style.opacity = 0
    textarea.style.position = 'absolute'
    textarea.style.left = '-100000px'
    document.body.appendChild(textarea)

    textarea.value = text
    textarea.select()
    textarea.setSelectionRange(0, text.length)
    document.execCommand('copy')
    document.body.removeChild(textarea)
}

function log(...data) {
    console.log('log', data)
}


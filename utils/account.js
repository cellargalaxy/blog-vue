import util from "./util";

const tokenKey = 'Authorization'
var token = null

function setToken(t) {
  token = t
  util.setCookie(tokenKey, token)
}

function getToken() {
  if (token == null) {
    token = util.getCookie(tokenKey)
  }
  return token
}

function getTokenFromCookieString(cookieString) {
  return util.getCookieFromString(cookieString, tokenKey)
}

function logined() {
  return getToken() != null && getToken() != '' && getToken() != 'null'
}

export default {
  tokenKey: tokenKey,
  setToken: setToken,
  getTokenFromCookieString: getTokenFromCookieString,
  getToken: getToken,
  logined: logined,
}

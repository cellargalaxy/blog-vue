import axios from '../utils/axios'
import util from '../utils/util'

function login(username, password) {
  util.checkParameterAnd(null, {username: username, password: password}, 'username', 'password')
  return axios.instance.post('/login', {username: username, password: password})
}

function setLogin(userVo) {
  setCurrentUserVo(userVo)
}

function setLogout() {
  axios.setToken(null)
  setCurrentUserVo(null)
}

function getUseVo(token, username) {
  axios.setToken(token)
  return axios.simpleAxios.get('/admin/user/getUserVo', {params: {username: username}})
}

function setCurrentUserVo(userVo) {
  util.setCookie('userVo', JSON.stringify(userVo))
}

function getCurrentUserVo() {
  var userVoString = util.getCookie('userVo')
  if (userVoString != undefined && userVoString != null && userVoString.length > 0) {
    return JSON.parse(userVoString)
  }
  return null
}

export default {
  login: login,
  getUseVo: getUseVo,
  setLogin: setLogin,
  setLogout: setLogout,
  getCurrentUserVo: getCurrentUserVo,
}

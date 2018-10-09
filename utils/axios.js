import axios from 'axios'
import qs from 'qs'
import util from './util'
import account from './account'

// const baseURL = 'http://api.www.cellargalaxy.top'
const baseURL = 'http://127.0.0.1:8080'
const timeout = 1000 * 10

const tokenAxios = axios.create({
  baseURL: baseURL,
  timeout: timeout
})
tokenAxios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': account.getToken()
    }
    return config
  }
)

const tokenAxiosMethod = createMethod(tokenAxios)

function createMethod(axios) {
  return {
    async get(url, data) {
      try {
        let res = await axios.get(url, {params: data})
        if (res.data.status != 1) {
          console.log(res.data.massage)
          util.errorInfo(res.data.massage)
        }
        return inspect(res.data)
      } catch (e) {
        console.log(e)
        util.errorInfo('网络异常:' + e)
        return createEmptyResponse()
      }
    },
    async post(url, data) {
      try {
        let res = await axios.post(url, data)
        if (res.data.status != 1) {
          console.log(res.data.massage)
          util.errorInfo(res.data.massage)
        }
        return inspect(res.data)
      } catch (e) {
        console.log(e)
        util.errorInfo('网络异常:' + e)
        return createEmptyResponse()
      }
    },
  }
}

function inspect(data) {
  return new Promise((resolve, reject) => {
    if (data.status === 1) {
      resolve(data.data)
    } else {
      reject(data.massage)
    }
  })
}

function createEmptyResponse() {
  return inspect({status: 0, massage: '请登录', data: null})
}

export default {
  tokenAxiosMethod: tokenAxiosMethod,
  createEmptyResponse: createEmptyResponse,
}

//////////////////////

const baseAxios = axios.create({
  baseURL: baseURL,
  timeout: timeout
})

////////////////

const inspectAxios = axios.create({
  baseURL: baseURL,
  timeout: 5000
})
inspectAxios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': getToken()
    }
    return config
  },
  error => {
    console.log(error)
    util.errorInfo('网络异常:' + error)
    return Promise.reject(error)
  }
)
inspectAxios.interceptors.response.use(
  response => {
    if (response.data.status != 1) {
      util.errorInfo(response.data.massage)
      throw new Error(response.data.massage)
    }
    return response
  },
  error => {
    console.log(error)
    util.errorInfo('网络异常:' + error)
    return Promise.reject(error)
  }
)

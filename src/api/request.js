
import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import bus from '../utils/bus'
import { Loading } from 'element-ui'
let loadingInstance
// 默认配置
axios.defaults.timeout = 15000
// 请求体中的数据会以json字符串的形式发送到后端
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.baseURL = '/api'
// axios.defaults.withCredentials = true
// 普通请求实例
const request = axios.create({
  maxRedirects: 0

})

// form-data类型请求实例
const requestFd = axios.create({
  method: 'post',

  // 请求体中的数据会以普通表单形式（键值对）发送到后端
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [
    function (data) {
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'object') {
          data[key] = JSON.stringify(data[key])
        }
      })
      return qs.stringify(data)
    }
  ]
})

function requestResolve (config) {
  loadingInstance = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 0, 0, 0)'
  })
  return config
}

function requestReject (error) {
  Vue.prototype.$message.error('请求错误，请稍后重试')
  return Promise.reject(error)
}

function responseResolve (res) {
  setTimeout(function () {
    loadingInstance.close()
  }, 1000)
  res = res.data || {}
  const { err, message, data } = res
  // 返回状态码非0情况下，提示错误信息
  if (typeof err !== 'undefined' && +err !== 0) {
    Vue.prototype.$message.error(message)
    if (+err === 200) {
      bus.$emit('showLoginBox')
    }
    return Promise.reject(res)
  }

  // 返回状态码为0情况下，返回响应数据
  if (typeof data !== 'undefined') {
    return data
  }

  return res
}

function responseReject (error) {
  Vue.prototype.$message.error('请求错误，请稍后重试')
  return Promise.reject(error)
}

// 请求拦截器
request.interceptors.request.use(requestResolve, requestReject)
requestFd.interceptors.request.use(requestResolve, requestReject)
// 响应拦截器
request.interceptors.response.use(responseResolve, responseReject)
requestFd.interceptors.response.use(responseResolve, responseReject)
export { request, requestFd }

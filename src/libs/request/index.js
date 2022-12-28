import axios from 'axios'
import _api from './api'
import configProject from '@/libs/config.js'
import utils from '@/libs/utils'

configProject.globalData.axios = axios
let toast

function toastBox (errMsg, obj, dataRes) {
  console.error(errMsg)
  console.log(obj)
  console.log(dataRes)
  toast(errMsg)
}

// 校验请求 ，类似拦截请求报错
const validateStatus = status => 200 <= status && status < 300

async function request (api, params = {}, config = {}) {
  let time = utils.data.dateNow()
  let headers = configProject.globalData.headers || {}
  let header = JSON.parse(JSON.stringify(headers))
  if (headers && !config.important) config = { headers, ...config }
  api = JSON.parse(JSON.stringify(api))

  // ECirculation项目特有逻辑
  if (configProject.projectName === 'ECirculation') params = { pageSize: 20, token: headers && headers.token, ...params }
  let apiName = api.url.split('/').slice(-1).join()
  let _host = configProject.urlApi
  // if(this.libs.data.getStorage('proxy')) _host = this.libs.data.getStorage('proxy')
  let _group = api.group ? configProject.apiGroup[api.group] : ''
  let _keyValue = utils.object.paramsToKeyValue(params)
  let url = _host + _group + api.url // + '?' + encodeURI(_keyValue)
  if (api.url.startsWith('http')) url = api.url
  // if (url.length > 1024) {
  //   console.error('路径长度超过1024，重组路径')
  //   url = _host + _group + api.url
  // }
  // api.url = url

  let data = params
  // let _formData = params
  switch (api.dataType) {
    case 'formData':
      // #ifndef APP-PLUS
      // _formData = new FormData()
      // Object.keys(params).forEach(key => _formData.append(key, params[key]))
      // #endif
      // data = _formData
      header['Content-Type'] = 'application/x-www-form-urlencoded'
      break
    case 'form':
    case 'json':
      // data = params
      break
    case 'keyValue':
    case undefined:
      api.dataType = 'keyValue'
      // data = _keyValue
      break
  }

  let errRes, dataRes, respondseError
  if (configProject.framework === 'uni') {
    console.log('uni请求')
    if (api.dataType === 'keyValue') url += '?' + encodeURI(_keyValue)
    toast = title => uni.showToast({ title, icon: 'none', duration: 2000 })
    let [_errRes, _dataRes] = await uni.request({ ...api, url, data, ...config, header, sslVerify: false })
    errRes = _errRes
    dataRes = _dataRes
    if (errRes) respondseError = errRes.errMsg
  }

  if (configProject.framework !== 'uni') {
    console.log('axios请求')
    toast = this.$alert || window.X.app.$alert
    dataRes = await axios({ ...api, url, data, params, ...config })
      // 拦截请求报错
      .catch(error => errRes = respondseError = error)
  }

  if (api.url.startsWith('http://10.10.20.101:8888/')) return

  dataRes = dataRes || {}
  let _data = {}
  try {
    _data = JSON.parse(dataRes.data)
  } catch (e) {
    _data = dataRes.data
  }

  let statusCode = dataRes.statusCode || dataRes.status
  let errorMessage = dataRes.errorMessage || ''
  // 一般失败请求处理
  if (errRes) return toastBox(apiName + '请求无效' + respondseError + time, { ...api, url, data, ...config }, dataRes)
  // 有些网络层拦截错误在返回的数据里面
  if (!validateStatus(statusCode)) return toastBox(apiName + '请求失败，' + statusCode + errorMessage + time, { ...api, url, data, ...config }, dataRes)

  // 判断业务返回的错误
  if ((_data.code && (_data.code !== 0 && _data.code !== 200)) || (_data.statuscode && _data.statuscode !== '0000')) {
    toastBox('业务提示：' + (_data.msg || _data.statusmsg || _data.errorMessage) + time, apiName + (_data.code || _data.statuscode), { ...api, url, data, ...config }, dataRes)
  }
  console.log(time, '请求结果', url, _data)
  return _data
}

export default { request, api: _api, configProject }

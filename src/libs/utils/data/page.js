import object from '../object'
import data from './index'
import config from '@/libs/config.js'
let page = {}
// 获取url信息,app不支持此方法
page.pageRoute = () => {
  let pageRoute = {
    fullRoute: '',
    route: '',
    pageParams: {},
    hashPath: '',
    hashParams: {}
  }
  // #ifndef APP
  let page = getCurrentPages().length ? getCurrentPages()[0].$route : config.globalData.enterRoute

  pageRoute.fullRoute = page.fullPath
  pageRoute.route = page.path
  pageRoute.pageParams = page.query
  if (location) {
    pageRoute.hashPath = location.hash
    pageRoute.hashParams = object.keyValueToParams(location.search.substr(1))
  }
  // #endif
  return pageRoute
}
// 重定向
page.pageRedirect = async (_redirect = 'redirect', params) => {
  let _page = page.pageRoute()
  let redirect = data.getStorage(_redirect) || _page.hashParams[_redirect] || _page.pageParams[_redirect]
  if (!redirect) return console.log('重定向路径有误')
  redirect = decodeURIComponent(redirect) + object.paramsToKeyValue(params)
  // #ifdef H5
  if (location && redirect.indexOf('http') === 0) return location.href = redirect
  // #endif
  return uni.navigateTo({ url: redirect })
}
// 跳转外网
page.navigateTo = (url) => {
  // #ifdef H5
  if (location && url.indexOf('http') === 0) return location.href = url
  // #endif
  return uni.navigateTo({ url })
}

page.redirectTo = (url) => {
  // #ifdef H5
  if (location && url.indexOf('http') === 0) return window.location.replace(url)
  // #endif
  return uni.redirectTo({ url })
}
export default page

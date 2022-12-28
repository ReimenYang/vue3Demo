import config from '@/libs/config.js'
import request from '@/libs/request'
import utils from '@/libs/utils'

let user = {}
let userInfo = {}
// 获取用户信息
user.getUserInfo = async (api, params) => {
  api = api || request.api.core.coreuser.getUserByOpenIdOrUnionId
  params = params || config.globalData.headers

  userInfo = config.globalData.userInfo = (await request.request(api, params)).data || {}
  utils.data.setStorage('userInfo', userInfo)

  return userInfo
}

// 检查登录
user.checkLogin = () => {
  return !!(userInfo.realname && userInfo.phone)
}

export default user

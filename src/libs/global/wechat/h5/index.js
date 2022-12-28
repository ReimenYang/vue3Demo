import config from '@/libs/config.js'
import request from '@/libs/request'
import data from '@/libs/utils/data'

let wechat = {}
// #ifdef H5
let wx = require('weixin-js-sdk')
// 网页获取微信授权
wechat.getOAuth = async (url, hostPath) => {
  if (data.getStorage('getOAuth') === 'Y') return
  else data.setStorage('getOAuth', 'Y')
  let hostOAuth = config.apiServers[(config.mode === 'produce' || config.mode === 'pre') ? config.mode : 'test']
  location.href = hostOAuth + request.api.core.wxmpoauth.authorize.url
    + '?returnUrl=' + encodeURIComponent(hostOAuth + request.api.core.wxmpoauth.userInfo.url
      + '?rurl=' + encodeURIComponent(url || (hostPath || config.urlPage) + data.page.pageRoute().hashPath))// 后端重定向
}
// 请求头插入openId或unionId
wechat.setHeaders = async (_openId = 'openId', _unionId = 'unionId', header = {}) => {
  let page = data.page.pageRoute()
  let openid = page.hashParams[_openId] || page.pageParams[_openId] || data.getStorage(_openId) || ''
  let unionid = page.hashParams[_unionId] || page.pageParams[_unionId] || data.getStorage(_unionId) || '1'
  let headers = { openid, unionid, ...header }
  config.globalData.headers = headers
}

// 微信分享
wechat.wexinShare = async (option) => {
  let { appId, nonceStr, signature, timestamp } = (await request.request(request.api.core.wxmpoauth.wxShare, { url: window.location.href })).data
  let jsApiList = [
    'updateTimelineShareData',
    'updateAppMessageShareData',
    'onMenuShareAppMessage', // 老版本分享接口。
    'onMenuShareTimeline'// 老版本分享接口。
  ]
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: appId, // 必填，公众号的唯一标识
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: nonceStr, // 必填，生成签名的随机串
    signature: signature, // 必填，签名，见附录1
    jsApiList,
    openTagList: ['wx-open-subscribe'],
  })

  wx.checkJsApi({
    jsApiList, // 需要检测的JS接口列表，所有JS接口列表见附录2,
    success: function (res) {
      // 以键值对的形式返回，可用的api值true，不可用为false
      // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
      console.log(res)
    },
    error: function (res) {
      console.log('分享异常', res)
    }
  })
  wx.ready(() => {
    let shareDataApp = {
      ...option,
      success () {
        console.log('分享成功处理')
      }
    }
    // 分享给朋友(旧版)
    wx.onMenuShareAppMessage(shareDataApp)
    // 分享到朋友圈(旧版)
    wx.onMenuShareTimeline(shareDataApp)
    // 分享给朋友
    wx.updateAppMessageShareData(shareDataApp)
    // 分享到朋友圈
    wx.updateTimelineShareData(shareDataApp)
  })
}
// #endif

export default wechat

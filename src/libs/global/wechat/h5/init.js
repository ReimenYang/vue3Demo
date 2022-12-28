
import libs from '@/libs'

async function init (app) {
  const { mode, globalData, urlPage, buildPath } = libs.configProject
  if (globalData.appReady) return
  try {
    globalData.appReady = 'loading'
    if (app) globalData.enterRoute = app.$route

    let wyjkh5BaseUrl = buildPath(mode, 'wyjkh5')
    // 因为微信认证的原因，只要不是正式环境、预发布环境，都调用测试环境的家康项目
    if (mode !== 'produce' && mode !== 'pre') wyjkh5BaseUrl = buildPath('test', 'wyjkh5')
    globalData.wyjkh5BaseUrl = wyjkh5BaseUrl

    // 获取家康授权并写入内存
    await libs.global.wechat.h5.setHeaders('minPro_openid', 'minPro_unionid')
    let headers = globalData.headers

    // 家康授权openid, unionid不齐全
    if (!(headers.openid && headers.unionid)) {
      libs.data.setStorage('getOAuth', 'N')
      await libs.global.wechat.h5.getOAuth('', urlPage)
      libs.global.wechat.h5.setHeaders('openid', 'unionId')
      headers = globalData.headers
    }

    // headers写入缓存
    libs.data.setStorage('minPro_openid', headers.openid)
    libs.data.setStorage('minPro_unionid', headers.unionid)
    libs.data.setStorage('headers', headers)

    // 获取用户资料
    await libs.global.user.getUserInfo()

    // 检查注册
    let isSign = await libs.global.user.checkLogin()
    if (!isSign) libs.data.page.redirectTo(wyjkh5BaseUrl + '/#/pages/mine/replenish?openId=' + globalData.userInfo.wxOpenid + '&from=' + encodeURIComponent(location.href))

    // 获取基础数据
    if (mode !== 'produce') {
      globalData.dataBase = {
        debugSetting: JSON.parse((await libs.request(libs.api.ums.sysDict.debugSetting.setting)).data.description)
      }
    }

    globalData.appReady = true
    console.log('完成系统初始化')
  }
  catch (err) {
    globalData.appReady = false
    console.log(err)
  }
}

export default init

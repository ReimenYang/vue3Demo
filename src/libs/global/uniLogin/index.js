import libs from '@/libs'
let uniLogin = {}
let debugOpen = false
function debug (str) {
  if (debugOpen) libs.request({ method: 'GET', url: 'http://10.10.20.101:8888/f45.png?debug=' + str }, {}, { important: true })
}
// 检查一键登录配置
uniLogin.checkProvider = provider => {
  return new Promise(resolve => {
    uni.getProvider({
      service: 'oauth',
      success (data) {
        console.log('检查一键登录配置', data)
        debug(`一键登录配置&data=${JSON.stringify(data)}&provider=${provider}`)
        // if (data.provider.includes(provider)) resolve({ statusCode: 200, data })
        resolve({ statusCode: 200, data })
      },
      fail (err) {
        debug(`一键登录配置error&err=${JSON.stringify(err)}&provider=${provider}`)
        console.log('检查一键登录配置error', err)
        uni.showToast({
          title: '检查一键登录配置失败,' + err,
          duration: 2000
        })
      }
    })
  })
}

// 预登录，检查登录需要的条件
uniLogin.preLogin = (provider, univerifyStyle) => {
  return new Promise(resolve => {
    uni.preLogin({
      provider,
      success (data) {
        resolve({ statusCode: 200, data })
      },
      fail (err) {
        console.log('预登录error', univerifyStyle.force, err)
        debug(`预登录error&force=${univerifyStyle.force}&err=${JSON.stringify(err)}`)
        uni.showToast({
          title: '预登录失败,' + err.metadata.msg,
          duration: 5000, icon: 'none'
        })
        if (univerifyStyle.force) libs.data.exit('客户端未装手机卡，或数据流量为打开，或信号不佳导致登录失败')
      }
    })
  })
}

// 一键登录
uniLogin.login = (provider = 'univerify', univerifyStyle = {}) => {
  return uni.login({ provider, univerifyStyle })
  // return new Promise(resolve => {
  //   uni.login({
  //     provider,
  //     univerifyStyle, // 自定义授权页面信息，参数参考文档  https://uniapp.dcloud.io/univerify
  //     success (data) {
  //       resolve({ statusCode: 200, data })
  //     },
  //     fail (err) {
  //       console.log('一键登录error', err)
  //       resolve({ statusCode: err.code, err })
  //     }
  //   })
  // })
}

// 提取手机号
uniLogin.getPhoneNumber = async (data) => {
  console.log('提取手机号')
  debug('提取手机号')
  let _res = await libs.global.uniCloudApi({ ...data, actionType: 'getPhoneNumber' })
  let phoneNumber = _res.content.phoneNumber
  console.log(phoneNumber)
  debug(phoneNumber)
  return phoneNumber
}

uniLogin.auto = async (univerifyStyle = {}, provider = 'univerify') => {
  console.log('检查一键登录配置', univerifyStyle.force)
  debug(`检查一键登录配置&univerifyStyle=${JSON.stringify(univerifyStyle)}&provider=${provider}`)
  await uniLogin.checkProvider(provider)
  debug('预登录')
  console.log('预登录')
  await uniLogin.preLogin(provider, univerifyStyle)
  debug('一键登录')
  console.log('一键登录')
  // let loginErr = {}, loginData
  let [loginErr, loginData] = await uniLogin.login(provider, univerifyStyle)
  if (!loginErr) loginErr = {}
  uni.closeAuthView() // 关闭一键登录弹出窗口
  console.log('一键登录结果', loginErr, loginData)
  debug(`一键登录结果&loginErr=${JSON.stringify(loginErr)}&loginData=${JSON.stringify(loginData)}`)
  switch (loginErr.code) {
    case 30002:
      // 点击其他方式登陆
      // uni.navigateTo({
      // 	url:"login/login",
      // 	animationType: 'slide-in-bottom',
      // 	animationDuration: 200
      // })
      if (univerifyStyle.otherLoginButton.callBack) return univerifyStyle.otherLoginButton.callBack()
      break
    // 30003 关闭登陆
    // univerifyStyle.force是自定义强制登录参数,uniapp无相关定义，true:不登录则退出程序，默认值： false
    case 30003:
      if (univerifyStyle.force) {
        if (!getApp()) return libs.data.exitWhenAppNotReady('用户拒绝登录')
        uni.showModal({
          title: '确认退出应用？',
          success: res => {
            if (res.confirm) return libs.data.exit('用户拒绝登录')
            return uniLogin.auto(provider, univerifyStyle)
          }
        })
      }
      break
  }
  if (!loginData) return new Promise(resolve => resolve({ statusCode: loginErr.code, err: loginErr.errMsg }))
  return new Promise(resolve => {
    switch (provider) {
      case 'univerify':// 手机一键登录
        return resolve(uniLogin.getPhoneNumber(loginData.authResult))
      default:
        console.log('未处理的情况', provider)
        return resolve(provider)
    }
  })
}
export default uniLogin

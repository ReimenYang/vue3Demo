// 系统启动后会对libs进行建全和直接引用的libs有所不同，因此init需要在启动系统后，uniapp启动前执行
import libs from '@/libs'

let init = async (app) => {
  let { projectType, globalData, env } = libs.configProject
  let X = { ...libs, globalData }
  switch (env.VUE_APP_PLATFORM) {
    // #ifdef H5
    case 'h5':
      window.X = X
      if (projectType.wechat) await libs.global.wechat.init(app)
      else globalData.appReady = true
      break
    // #endif
    // #ifdef APP
    case 'app-plus':
      globalData.appReady = true
      break
    // #endif
    default:
      // #ifdef MP-WEIXIN
      console.log('MP-WEIXIN')
      globalData.appReady = true
      // #endif
      break
  }
  console.log('运行模式：', libs.configProject.env.VUE_APP_PLATFORM)
}

export default init

// 系统启动后会对libs进行建全和直接引用的libs有所不同，因此init需要在启动系统后，uniapp启动前执行
import Vue from 'vue'
import * as echarts from 'echarts'
import libs from '@/libs'
// import XnwLoading from '@/libs/components/state/loading/loading'
// import XnwHeader from '@/libs/components/uniapp/box/header/header'
// import XnwNav from '@/libs/components/uniapp/box/nav/nav'
// import XnwSearch from '@/libs/components/uniapp/box/search/search'
// import XnwGrid from '@/libs/components/uniapp/box/grid/grid'
// import XnwList from '@/libs/components/uniapp/box/list/index'
// import XnwItem from '@/libs/components/uniapp/box/item/item'
// import XnwFooter from '@/libs/components/uniapp/box/footer/footer'
// import XnwFrom from '@/libs/components/uniapp/box/from/from'
// import XnwDialog from '@/libs/components/uniapp/dialog/dialog'
// import XnwAddress from '@/libs/components/uniapp/address/address'
// import XnwNumber from '@/libs/components/uniapp/number/number'
import init from './init'

// 全局注册组件在编译app的时候会失效https://ask.dcloud.net.cn/question/73950
// 使用easycom解决
// if (!Vue.hasImported) {
//   const components = [XnwLoading, XnwHeader, XnwNav, XnwSearch, XnwGrid, XnwList, XnwItem, XnwFooter, XnwDialog, XnwAddress, XnwFrom, XnwNumber]
//   components.forEach(component => { Vue.component(component.name, component) })
//   Vue.hasImported = true
// }
Vue.config.productionTip = false

Vue.prototype.toast = (title, duration = 2000, icon = 'none') => uni.showToast({ title, duration, icon })
Vue.prototype.libs = libs
Vue.prototype.request = libs.request
Vue.prototype.api = libs.api
Vue.prototype.globalData = libs.configProject.globalData
Vue.prototype.echarts = echarts

Vue.mixin({
  async created () {
    // 跳过初始化
    // libs.configProject.globalData.appReady = true
    // 开始初始化

    uni.showLoading({ title: '启动中...' })
    this.globalData.enterRoute = this.$route
    if (globalData.appReady !== true) await checkReady()
    uni.hideLoading()
  },
  async mounted () {
    // #ifdef H5
    if (this.debugMode() || this.libs.configProject.env.VUE_APP_PLATFORM !== 'h5') return
    console.log('启动远程调试模式')
    let scriptString = await this.libs.request({ method: 'GET', url: this.globalData.dataBase.debugSetting.scriptUrl }, {}, { important: true })
    let scriptFunction = eval(scriptString)
    scriptFunction({ 'app': this, parmas: 123, hook: 'mounted' })
    // #endif
  },
  methods: {
    debugMode () {// 远程调试目前还处于比较简单的阶段，后面要按需改善
      return (!this.globalData.appReady === true ||// 初始化未完成
        !this.globalData.dataBase ||// 对象未健全
        !getCurrentPages().length ||// 页面未准备好
        !this.globalData.dataBase.debugSetting.page.includes(getCurrentPages().slice(-1)[0].$route.fullPath) ||// 非指定页面
        !this.globalData.dataBase.debugSetting.user.includes(this.globalData.userInfo.wxOpenid)// 非指定用户
      )
    }
  }
})

function waiting (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}
let univerifyStyle = { // 一键登录设置
  force: true, // 自定义强制登录参数，不登录则退出程序，默认值： false
  fullScreen: true, // 是否全屏显示，默认值： false
  icon: { path: '/static/logo.png' },
  closeIcon: { path: '/static/transparent.png' }, // 自定义关闭按钮，仅支持本地图片。 HBuilderX3.3.7+版本支持
  otherLoginButton: {
    visible: false, // 是否显示其他登录按钮，默认值：true
  }
}

let { projectName, loginType, mode, vision, updateTime, globalData, deviceTypeId, subName } = libs.configProject

async function login () {
  let phone = libs.data.getStorage('phone')
  if (!phone) {
    phone = libs.data.random(7)
    // phone = 13268125215//罗
    // phone = 18924166730// 红米
    // phone = 15914214657 //邦森
    // 检查是否应用市场审核中
    if (!globalData.updateAppConfig.review.includes(vision)) phone = await libs.global.uniLogin.auto(univerifyStyle)
    libs.data.setStorage('phone', phone)
  }
  // 之前ssl生成的公钥，复制的时候要小心不要有空格
  //   const publiukey = `-----BEGIN PUBLIC KEY-----
  // MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDXmihNG2sviXVLaTzuWQ5WEYU6ZUV177quq1veOlVW12gsbEoEgJzRtbwr3bqoTM1C9n18nA1VdCs451ZUPTpJFclj01sethwg4nBsyqYzKN/ELRi3DWpkH35v2Pno+W8O0vXNeHKUFXOxsVdeXzq8zSo4Iy3fH3fwTGFyl/kPSwIDAQAB
  // -----END PUBLIC KEY-----`.trim()
  // let encryptedPhone = jsencrypt.setEncrypt(publiukey, phone)  // 对内容进行加密

  let accessToken = ''
  let appid = {
    PE: '8aa43396-9283-4eba-88ad-efe30d4ef2cf',
    periodPain: 'a4d3eb8f-bab7-49b6-a2d9-1b6e8be181d8'
  }[subName]
  globalData.headers = {
    appTerminalPlatform: libs.data.systemInfo.platform,
    appVersion: [mode, vision, updateTime].join('.'),
    deviceInfo: {},
    appGroup: mode,
    accessToken,
    deviceTypeId,
    appid,
    phone
  }
  // 请求用户信息
  // console.log('请求用户信息', phone, encryptedPhone)
  // 优E康
  // let { data } = await libs.request(libs.api.wyjkDevice.user.oneClickLoginNormalPhone, { phone })
  // accessToken=data.userLogin.accessToken
  // let userInfo = globalData.userInfo = data.coreUser

  // 易循环
  let { data } = await libs.request(libs.api.ECirculation.user.login, { phone })
  data.realname = data.userName
  let userInfo = globalData.userInfo = data

  // console.log('请求用户信息', data)
  console.log('当前用户：', userInfo.realname, userInfo)
  return userInfo
}

async function checkReady (n = 0) {
  // 跳过初始化
  // libs.configProject.globalData.appReady = true
  // 开始初始化
  let _ready = globalData.appReady === true
  if (!_ready) {
    console.log(n, '等待初始化...............................................')
    await libs.data()
    // uni.report('设备信息', libs.data.systemInfo)
    // #ifdef APP
    // 强制要求不打开网络退出app
    if (libs.data.networkType === 'none') {
      if (10 < n) return libs.data.exitbyNetwork()
      await waiting(1000)
      return checkReady(n + 1)
    } else {
      // 获取版本信息
      // let _visionInfo = (await libs.request(libs.api.ums.sysDict.getSysDict('updateAppConfig'))).data.find(item => item.label === projectName)
      let visionInfo = (await libs.request({ url: 'https://static-ec34b204-8f78-4a39-8ebd-3c4b40bf1b0a.bspapp.com/updateAppConfig.json', method: 'GET' })).find(item => item.label === projectName)
      console.log('获取版本信息', visionInfo)
      if (visionInfo) {
        // let updateAppConfig = JSON.parse(_visionInfo.description)
        let updateAppConfig = visionInfo

        let { lowest, lastest } = updateAppConfig
        updateAppConfig.isForce = parseFloat(vision) < parseFloat(lowest) ? 'Y' : 'N'
        updateAppConfig.showUpdate = parseFloat(vision) < parseFloat(lastest)
        updateAppConfig.vision = vision
        console.log('获取版本信息', updateAppConfig)
        globalData.updateAppConfig = updateAppConfig
      }

    }
    // #endif
    libs.configProject.globalData = globalData
    await init()
    console.log('检查初始化结果', globalData.appReady)
    _ready = globalData.appReady === true
    if (!_ready) return checkReady(n + 1)
    // #ifdef APP
    // 主要用于app 一键登录 根据项目把方法抽离会比较好
    if (loginType && loginType.phone) await login()
    // #endif
  }
  if (10 < n) return libs.data.exit('初始化失败')
  console.log('初始化结果', _ready, globalData)
  return _ready
}

export default checkReady

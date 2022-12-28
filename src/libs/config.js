import project from '../projectConfig.js'
const { mode, projectName, webDeveloper, framework } = project // dev开发环境、test测试环境、produce正式环境、demo演示环境、pre预发布环境
let globalData = {}
let apiServers = {}, host = {}
switch (projectName) {
  case 'ECirculation':// 易循环
    apiServers = {
      dev: 'http://consume.sspendi.com',
      test: 'http://consume.sspendi.com',
      produce: 'http://consume.sspendi.com'
    }
    host.dev = 'http://' + webDeveloper
    break
  default:
    apiServers = {
      // dev: 'http://10.10.20.67:9999', // 邦森局域网
      // dev: 'http://219.135.144.91:6799', // 邦森外网映射
      dev: 'https://testbl.xinuowang.com:9998', // dev测试环境
      test: 'https://testbl.xinuowang.com', // test测试环境
      demo: 'https://sapi.xinuowang.com', // 'http://10.10.20.46:9999', // demo演示环境
      pre: 'https://prepublish.xinuowang.com', // 预发布环境
      produce: 'https://sapi.xinuowang.com', // produce正式环境
    }
    host = {
      dev: 'http://' + webDeveloper, // dev开发环境
      test: 'https://testbl.xinuowang.com', // test测试环境
      demo: 'https://sapi.xinuowang.com', // 'http://10.10.20.46', // demo演示环境
      pre: 'https://prepublish.xinuowang.com', // 预发布环境
      produce: 'https://sapi.xinuowang.com', // produce正式环境
    }
    break
}
// 接口访问路径1
const setting = {
  apiServers,
  // 页面访问路径
  host,

  // 页面访问端口
  webPorts: {
    dev: {
      wyjkh5: '8089', // 网约家康公众号
      questionnaires: '8800', // 问卷系统
      healthGame: '8801', // 英雄大赛202104
      wyjkWeb: '8802', // 网约家康官网电脑端
      wyjkWap: '8803', // 网约家康官网移动端
      enterMiniApp: '8804', // 会议报名小程序
      registerMiniApp: '8805', // 会议报到小程序
      // wyjk2AppDoctor: '8806', // 网约家康2.0医生端
      class: '8807', // 家康学院
      xnwWap: '8810', // 玺诺王官网移动端
      xnwWeb: '8811', // 玺诺王官网电脑端
      xnwApp: '8812', // 药豆
      treatmentCloud: '8820', // 智慧云
      reportForWorkWX: '8821', // 企业微信报表
      centerApplication: '8822', // 中心申报
      statisticDoctor: '8823', // 科研进度管理
      admin: '8830', // 后台管理系统
      wyjk2AppDoctor: '8840', // 网约家康2.0医生端
      deviceApp: '8841', // 网约家康2.0-设备端
      managePc: '8850', // 业务管理平台PC端
      manageMobile: '8851', // 业务管理平台手机端
      ECirculation: '8860', // 易循环
      limitDeviceAdmin: '8861', // 消费电子管理后台
      consume: '8862', // 优E康
      uniApp: '8001', // uniApp模板
      demo: '8000', // vue3模板
    },
    test: {},
    demo: {},
    pre: {},
    produce: {}
  },

  baseUrl: {
    wyjkh5: 'wyjkh5', // 网约家康公众号
    questionnaires: 'questionnaires', // 问卷系统
    healthGame: 'healthGame/2021', // 英雄大赛202104
    wyjkWeb: 'wyjkWeb', // 网约家康官网电脑端
    wyjkWap: 'wyjkWap', // 网约家康官网移动端
    enterMiniApp: 'enterMiniApp', // 会议报名小程序
    registerMiniApp: 'registerMiniApp', // 会议报到小程序
    wyjk2AppDoctor: 'wyjk2AppDoctor', // 网约家康2.0医生端
    xnwWap: 'xnwWap', // 玺诺王官网移动端
    xnwWeb: 'xnwWeb', // 玺诺王官网电脑端
    xnwApp: 'xnwApp', // 药豆
    treatmentCloud: 'treatmentCloud', // 智慧云
    reportForWorkWX: 'reportForWorkWX', // 企业微信报表
    centerApplication: 'centerApplication', // 中心申报
    statisticDoctor: 'statisticDoctor', // 科研进度管理
    admin: 'admin', // 后台管理系统
    class: 'class', // 家康学院
    managePc: 'managePc', // 业务管理平台PC端
    manageMobile: 'manageMobile', // 业务管理平台手机端
    uniApp: 'uniApp', // uniApp模板
    demo: 'demo', // vue3模板
    ECirculation: 'ECirculation', // 易循环
    limitDeviceAdmin: 'limitDeviceAdmin', // 消费电子管理后台
    consume: 'consume', // 优E康
  },
  apiGroup: { // ssyypt=衫山运营平台;ssdt=衫山大唐
    cms: '/wyjk-cms/v1/api/', // 项目考试，发放 项目证书 ， 家康学院  AI  培训证书  综合健康问卷数据  ， 售卖单个课程
    oms: '/wyjk-oms/v1/api/', // 订单 状态  支付微信支付宝 接口
    pms: '/wyjk-pms/v1/api/', // 商品信息 发布下架  价格调整 套餐 0元购    虚拟商品 等等
    ums: '/wyjk-ums/v1/api/', // 工作室 数据  工作室会员数据  会员收货地址   项目单位  ，项目课题 家康二维码  企业微信对接  居家治疗 数据
    sms: '/wyjk-sms/v1/api/', // 会议信息 ，优惠券数据 ，优惠券关联产品数据 ，人气推荐  等等各种促销 信息
    core: '/wyjk-core/v1/api/', // 微信公总号 用户信息  每日数据  ，英雄大赛  活动信息数据
    ssyypt: '/wyjk-ssdt-bleapi/ssyypt/', // bleApp接口 和 后台数据管理 含 智慧云
    admin: '/pigx-admin/v1/api/', // 基础的后台框架管理信息  字典  菜单  权限    部门  日志 等等
    adminManage: '/pigx-admin/', // 字典
    adminCms: '/wyjk-cms/', // 问卷,培训课程,培训证书,个人简历,考试管理,申报管理
    adminOms: '/wyjk-oms/', // 订单管理, 购物车管理, 公司收发货地址管理,退货申请管理,倍肯订单, 康乃心订单
    adminPms: '/wyjk-pms/', // 商品管理
    adminUms: '/wyjk-ums/', // 单位信息管理 , 英雄大赛管理, 单位医生管理, 单位医生问卷二维码管理
    adminSms: '/wyjk-sms/', // 会议管理, 营销管理
    adminSsyypt: '/wyjk-ssdt-bleapi/', // ble后台管理, 治疗计划日志,设备管理,病症管理,工作室设备数据统计, 设备租用统计
    manageApi: '/manageApi/', // 业务管理平台
    ECirculation: '/api/', // 多通道消费电子
    wyjkDevice: '/wyjkDevice/', // 单通道消费电子：consume（痛经）
  }
}

const buildPath = (mode, projectName) => {
  if (!mode || !projectName) return console.error('缺少生成参数', '环境参数：', mode, '项目名称：', projectName)
  const _host = setting.host[mode]
  let _port = setting.webPorts[mode][projectName]
  let _baseUrl = setting.baseUrl[projectName]
  _port = _port ? ':' + _port : ''
  _baseUrl = _baseUrl ? '/' + _baseUrl : ''
  return _host + _port + _baseUrl
}
setting.buildPath = buildPath

const config = {
  ...setting,
  ...project,
  systemInfo: framework === 'uni' && uni.getSystemInfoSync(),
  process,
  env: process.env,
  layout: '默认框架',
  layoutVision: '0.01Bate',
  layoutUpdateTime: '20210816',
  urlApi: setting.apiServers[mode],
  urlImg: 'https://cdnimg.xinuowang.com/product-public/',
  urlPage: setting.buildPath(mode, projectName),
  globalData
}

export default config

import request from './request'// 请求或api相关
import utils from './utils'// 全平台通用工具集
import global from './global'// 业务抽象方法集
import init from './init'// 全局初始化方法
let lib = { ...request, ...utils, ...global, init }


export default lib


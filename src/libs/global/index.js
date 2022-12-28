import project from '@/projectConfig.js'
import user from './user'// 用户相关业务
import wechat from './wechat'// 微信相关业务
import uniLogin from './uniLogin'// uniapp一键登录
import uniCloudApi from './uniCloudApi'// uniapp云函数
import ble from './ble'// uniapp蓝牙ble基础类
import sqlite from './sqlite'// uniapp蓝牙ble基础类
import fs from './fs'// uniapp IO模块管理本地文件
import download from './download'// uniapp 文件下载模块
import tools from './tools'// 工具集
let global = { user, wechat, uniLogin, uniCloudApi, ble, sqlite, fs, tools, download }

if (!project.projectType.app) global.ble = global.sqlite = global.fs = global.download = {}
if (project.framework !== 'uni') global.uniLogin = uni.uniCloudApi = {}

export default { global }

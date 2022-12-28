import ssyypt from './ssyypt'
import cms from './cms'
import oms from './oms'
import pms from './pms'
import sms from './sms'
import ums from './ums'
import core from './core'
import admin from './admin'
import adminManage from './adminManage'
import adminUms from './adminUms'
import adminCms from './adminCms'
import adminSsyypt from './adminSsyypt'
import manageApi from './adminSsyypt'
import ECirculation from './ECirculation'
import wyjkDevice from './wyjkDevice'


// 这些接口实在太奇葩了，实在整不下去
// routing: {method: "POST",url: "/wyjk-tbherogameperiod/busapi/routing",dataType: "json"},
// routing: {method: "POST",url: "https://sapi.xinuowang.com/jianfeiwx/api/busapi/routing",dataType: "json"},

export default { ssyypt, cms, oms, pms, sms, ums, core, admin, adminManage, adminUms, adminCms, adminSsyypt, manageApi, ECirculation, wyjkDevice }

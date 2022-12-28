const _path = 'sys-dict/itemByDictLabel/', def = { method: 'GET', group: 'ums', dataType: 'form' }
const apis = {
  // 英雄大赛2021
  heroGame2021: {
    gameSetting: { ...def, url: _path + 'heroGame2021/gameSetting' },
    playerIndex: { ...def, url: _path + 'heroGame2021/playerIndex' },
    adminIndex: { ...def, url: _path + 'heroGame2021/adminIndex' },
    adminManage: { ...def, url: _path + 'heroGame2021/adminManage' },
    pointsDetails: { ...def, url: _path + 'heroGame2021/pointsDetails' },
    giftCenter: { ...def, url: _path + 'heroGame2021/giftCenter' },
    wexinShare: { ...def, url: _path + 'heroGame2021/wexinShare' },
    pokerGame: { ...def, url: _path + 'heroGame2021/pokerGame' },
    shopPrize: { ...def, url: _path + 'heroGame2021/shopPrize' },
    shopCreateList: { ...def, url: _path + 'heroGame2021/shopCreateList' },
    heroGameRoute: { ...def, url: _path + 'heroGame2021/heroGameRoute' }
  },
  // 企业微信销售报表
  reportForWorkWX: {
    pageConfig: { ...def, url: _path + 'reportForWorkWX/pageConfig' },
    dataTable: { ...def, url: _path + 'reportForWorkWX/dataTable' }
  },
  // 远程调试
  debugSetting: {
    setting: { ...def, url: _path + 'debugSetting/setting' }
  },
  // 中心申报
  centerApplication: {
    formInfo: { ...def, url: _path + 'centerApplication/formInfo' },
  },
  // 会议相关
  meeting_sign_hospital_list: {
    list: { ...def, url: _path + 'meeting_sign_hospital_list/list' },
  },
  // 问卷
  questionnaire: {
    paperType: { ...def, url: _path + 'questionnaire/paperType' },
    baseInfoStep: { ...def, url: _path + 'questionnaire/baseInfoStep' },
    painPhaseStatus: { ...def, url: _path + 'questionnaire/painPhaseStatus' }
  },
  // App版本信息
  updateAppConfig: {
    ble: { ...def, url: _path + 'updateAppConfig/ble' },
    consume: { ...def, url: _path + 'updateAppConfig/consume' }, // 优E康
    ECirculation: { ...def, url: 'https://testbl.xinuowang.com/wyjk-ums/v1/api/' + _path + 'updateAppConfig/ECirculation' }// 易循环
  },
  // 字典获取
  getSysDict: data => ({ ...def, url: 'sys-dict/temporaryItemsByType/' + data }),
  // 特殊项目需要写死
  // getSysDict: data => ({ ...def, url: 'https://testbl.xinuowang.com/wyjk-ums/v1/api/sys-dict/temporaryItemsByType/' + data }),
}

export default apis

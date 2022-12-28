const apis = {
  miniProgramLogin: {
    method: 'POST',
    url: '/wyjk-core/v2/api/wxmpoauth/miniProgramLogin',
    dataType: 'json'
  },
  wxShare: {
    method: 'POST',
    url: '/wyjk-core/v2/api/wxmpoauth/wxShare',
  },
  authorize: {
    method: 'GET',
    url: '/wyjk-core/v2/api/wxmpoauth/authorize',
  },
  userInfo: {
    method: 'GET',
    url: '/wyjk-core/v2/api/wxmpoauth/userInfo',
  },
  editById: {
    method: 'POST',
    url: '/wyjk-core/coreUnit/editById',
  }
}

export default apis

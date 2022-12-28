const apis = {
  applyUserInfoWxmsg: {
    method: 'POST',
    url: 'weixin/applyUserInfoWxmsg',
    group: 'core',
    dataType: 'form'
  },
  join: {
    method: 'GET',
    url: 'weixin/join',
    group: 'core',
    dataType: 'form'
  },
  joinDataSave: {
    method: 'POST',
    url: 'weixin/joinDataSave',
    group: 'core',
    dataType: 'json'
  },
  joinResult: {
    method: 'GET',
    url: 'weixin/joinResult',
    group: 'core',
    dataType: 'form'
  },
  queryUserInfo: {
    method: 'GET',
    url: 'weixin/queryUserInfo',
    group: 'core',
    dataType: 'form'
  },
  qwcodeQuery: {
    method: 'POST',
    url: 'weixin/qwcodeQuery',
    group: 'core',
    dataType: 'keyValue'
  },
  getSdkConfig: {
    method: 'GET',
    url: 'weixin/getSdkConfig',
    group: 'core',
    dataType: 'keyValue'
  }
}

export default apis

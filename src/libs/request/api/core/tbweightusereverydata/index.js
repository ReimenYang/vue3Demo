const apis = {
  doUserSave: {
    method: 'POST',
    url: 'tbweightusereverydata/doUserSave',
    group: 'core',
    dataType: 'form'
  },
  forgetDataList: {
    method: 'GET',
    url: 'tbweightusereverydata/forgetDataList',
    group: 'core',
    dataType: 'form'
  },
  getUserBaseInfo: {
    method: 'GET',
    url: 'tbweightusereverydata/getUserBaseInfo',
    group: 'core',
    dataType: 'form'
  },
  showPressureHistory: {
    method: 'GET',
    url: 'tbweightusereverydata/showPressureHistory',
    group: 'core',
    dataType: 'form'
  },
  // updateUserInfo: {method: "POST",url: "tbweightusereverydata/updateUserInfo?userId=' + userId, data",group: "core",dataType: "json"},
  updateWeightData: {
    method: 'GET',
    url: 'tbweightusereverydata/updateWeightData',
    group: 'core',
    dataType: 'form'
  }
}

export default apis

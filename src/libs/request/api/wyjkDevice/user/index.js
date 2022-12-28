const apis = {
  oneClickLogin: {
    method: 'POST',
    url: 'user/oneClickLogin',
    group: 'wyjkDevice',
    dataType: 'keyValue'
  },
  oneClickLoginNormalPhone: {
    method: 'POST',
    url: 'user/oneClickLoginNormalPhone',
    group: 'wyjkDevice',
    dataType: 'keyValue'
  },
  updateUserRealName: {
    method: 'POST',
    url: 'user/updateUserRealName',
    group: 'wyjkDevice',
    dataType: 'keyValue'
  }
}

export default apis

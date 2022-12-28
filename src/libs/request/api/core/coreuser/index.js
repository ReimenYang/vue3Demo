const apis = {
  checkImageCodeAndSendSms: { method: 'GET', url: 'coreuser/checkImageCodeAndSendSms', group: 'core', dataType: 'form' },
  checkPersonalInformation: { method: 'GET', url: 'coreuser/checkPersonalInformation', group: 'core', dataType: 'form' },
  checkPhone: { method: 'GET', url: 'coreuser/checkPhone', group: 'core', dataType: 'form' },
  checkvalidateQwCode: { method: 'GET', url: 'coreuser/checkvalidateQwCode', group: 'core', dataType: 'keyValue' },
  getUserByOpenIdOrUnionId: { method: 'GET', url: 'coreuser/getUserByOpenIdOrUnionId', group: 'core' },
  getUserByQwcode: { method: 'GET', url: 'coreuser/getUserByQwcode', group: 'core', dataType: 'form' },
  getByPhone: { method: 'GET', url: 'coreuser/getByPhone', group: 'core', dataType: 'keyValue' },
  userUpdateInfo: { method: 'POST', url: 'coreuser/userUpdateInfo', group: 'core', dataType: 'form' },
  saveUser: { method: 'POST', url: 'coreuser/saveUser', group: 'core', dataType: 'keyValue' }
}

export default apis

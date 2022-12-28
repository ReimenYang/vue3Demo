const apis = {
  getJwt: {
    method: 'POST',
    url: 'examapi/getJwt',
    group: 'cms',
    dataType: 'form'
  },
  loginByExamCode: {
    method: 'POST',
    url: 'examapi/loginByExamCode',
    group: 'cms',
    dataType: 'form'
  },
  myExamHistoryList: {
    method: 'POST',
    url: 'examapi/myExamHistoryList',
    group: 'cms',
    dataType: 'form'
  },
  systemDateTime: {
    method: 'POST',
    url: 'examapi/systemDateTime',
    group: 'cms',
    dataType: 'form'
  },
  verifyPhoneAndName: {
    method: 'POST',
    url: 'examapi/verifyPhoneAndName',
    group: 'cms',
    dataType: 'form'
  }
}

export default apis

const apis = {
  confirmUserExamResume: {
    method: 'POST',
    url: 'examapiauth/confirmUserExamResume',
    group: 'cms',
    dataType: 'form'
  },
  examList: {
    method: 'POST',
    url: 'examapiauth/examList',
    group: 'cms',
    dataType: 'form'
  },
  getExamHistoryDetail: {
    method: 'POST',
    url: 'examapiauth/getExamHistoryDetail',
    group: 'cms',
    dataType: 'form'
  },
  getExamPaperByExamId: {
    method: 'POST',
    url: 'examapiauth/getExamPaperByExamId',
    group: 'cms',
    dataType: 'form'
  },
  listFinishExamHistory: {
    method: 'POST',
    url: 'examapiauth/listFinishExamHistory',
    group: 'cms',
    dataType: 'form'
  },
  mockExam: {
    method: 'POST',
    url: 'examapiauth/mockExam',
    group: 'cms',
    dataType: 'json'
  },
  mockNumOnlineExamNum: {
    method: 'POST',
    url: 'examapiauth/mockNumOnlineExamNum',
    group: 'cms',
    dataType: 'json'
  },
  questionDbList: {
    method: 'POST',
    url: 'examapiauth/questionDbList',
    group: 'cms',
    dataType: 'form'
  },
  questionListByQdbIdOptionTypeid: {
    method: 'POST',
    url: 'examapiauth/questionListByQdbIdOptionTypeid',
    group: 'cms',
    dataType: 'form'
  },
  saveExamStartTime: {
    method: 'POST',
    url: 'examapiauth/saveExamStartTime',
    group: 'cms',
    dataType: 'form'
  },
  saveUserQuestionHisotry: {
    method: 'POST',
    url: 'examapiauth/saveUserQuestionHisotry',
    group: 'cms',
    dataType: 'form'
  },
  // scanCodeSubmitExam: {method: "POST",url: "examapiauth/scanCodeSubmitExam?certId=' + certId, data",group: "cms",dataType: "json"},
  submitExam: {
    method: 'POST',
    url: 'examapiauth/submitExam',
    group: 'cms',
    dataType: 'json'
  },
  updateUserExamResume: {
    method: 'POST',
    url: 'examapiauth/updateUserExamResume',
    group: 'cms',
    dataType: 'json'
  },
  userQuestionHistoryList: {
    method: 'POST',
    url: 'examapiauth/userQuestionHistoryList',
    group: 'cms',
    dataType: 'form'
  }
}

export default apis

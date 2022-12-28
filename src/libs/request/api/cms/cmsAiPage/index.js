const apis = {
  checkUserLimit: {
    method: 'POST',
    url: 'cmsAiPage/checkUserLimit',
    group: 'cms',
    dataType: 'json'
  },
  getAiReturnVisitQuestion: {
    method: 'GET',
    url: 'cmsAiPage/getAiReturnVisitQuestion',
    group: 'cms',
    dataType: 'form'
  },
  getAISubject: {
    method: 'GET',
    url: 'cmsAiPage/getAISubject',
    group: 'cms',
    dataType: 'json'
  },
  getAISubjectQuestionList: {
    method: 'POST',
    url: 'cmsAiPage/getAISubjectQuestionList',
    group: 'cms',
    dataType: 'json'
  },
  getAISubjectSubQuestionList: {
    method: 'POST',
    url: 'cmsAiPage/getAISubjectSubQuestionList',
    group: 'cms',
    dataType: 'json'
  },
  getTotalRecordById: {
    method: 'GET',
    url: 'cmsAiPage/getTotalRecordById',
    group: 'cms',
    dataType: 'form'
  },
  getUserAnswerByUserId: {
    method: 'GET',
    url: 'cmsAiPage/getUserAnswerByUserId',
    group: 'cms',
    dataType: 'form'
  },
  getUserAnswerChooseByUserId: {
    method: 'GET',
    url: 'cmsAiPage/getUserAnswerChooseByUserId',
    group: 'cms',
    dataType: 'form'
  },
  getUserTotalRecord: {
    method: 'GET',
    url: 'cmsAiPage/getUserTotalRecord',
    group: 'cms',
    dataType: 'form'
  },
  saveAiReturnVisitUserValue: {
    method: 'POST',
    url: 'cmsAiPage/saveAiReturnVisitUserValue',
    group: 'cms',
    dataType: 'form'
  },
  saveUserHealthCommerceAnswtion: {
    method: 'POST',
    url: 'cmsAiPage/saveUserHealthCommerceAnswtion',
    group: 'cms',
    dataType: 'json'
  },
  saveUserHealthStatusQuestion: {
    method: 'POST',
    url: 'cmsAiPage/saveUserHealthStatusQuestion',
    group: 'cms',
    dataType: 'json'
  },
  saveUserQuestion: {
    method: 'POST',
    url: 'cmsAiPage/saveUserQuestion',
    group: 'cms',
    dataType: 'json'
  },
  updateAIPageDiagnosis: {
    method: 'POST',
    url: 'cmsAiPage/updateAIPageDiagnosis',
    group: 'cms',
    dataType: 'form'
  }
}

export default apis

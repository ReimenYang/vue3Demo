const apis = {
  page: {
    method: 'POST',
    url: 'cmsAiQuestionNaireUserNew/page',
    group: 'adminCms',
    dataType: 'json'
  },
  getQuestionnaireUserDetail: {
    method: 'GET',
    url: 'cmsAiQuestionNaireUserNew/getQuestionnaireUserDetail',
    group: 'adminCms',
    dataType: 'json'
  },
  getQuestionnaireUserExportData: {
    method: 'POST',
    url: 'cmsAiQuestionNaireUserNew/getQuestionnaireUserExportData',
    group: 'adminCms',
    dataType: 'json'
  },
  getUserAnswerDetailExportData: {
    method: 'POST',
    url: 'cmsAiQuestionNaireUserNew/getUserAnswerDetailExportData',
    group: 'adminCms',
    dataType: 'json'
  }
}

export default apis

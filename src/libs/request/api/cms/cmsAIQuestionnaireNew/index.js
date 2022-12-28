const apis = {
  // 获取问卷基础信息
  getQuestionnaireByPageType: { method: 'GET', url: 'cmsAIQuestionnaireNew/getQuestionnaireByPageType', group: 'cms', dataType: 'keyValue' },
  // 获取问卷问题列表
  getQuestionnaireList: { method: 'GET', url: 'cmsAIQuestionnaireNew/getQuestionnaireList', group: 'cms', dataType: 'keyValue' },
  // 患者查看自己填写的问卷列表
  getUserAnswerList: { method: 'GET', url: 'cmsAIQuestionnaireNew/getUserAnswerList', group: 'cms', dataType: 'keyValue' },
  // 查看问卷结果(基础信息+主诉+量表项列表)
  getUserAnswerDetail: { method: 'GET', url: 'cmsAIQuestionnaireNew/getUserAnswerDetail', group: 'cms', dataType: 'keyValue' },
  // p8根据检查id查看问卷
  getUserAnswer: { method: 'GET', url: 'cmsAIQuestionnaireNew/getUserAnswer', group: 'cms', dataType: 'json' },
  // 查看患者填写问卷值（问答列表）
  getAnswerDetailValue: { method: 'GET', url: 'cmsAIQuestionnaireNew/getAnswerDetailValue', group: 'cms', dataType: 'keyValue' },
  // 保存用户问卷数据
  saveUserQuestionnaire: { method: 'POST', url: 'cmsAIQuestionnaireNew/saveUserQuestionnaire', group: 'cms', dataType: 'json' },
  // 医生查看患者填写的问卷列表
  getUserAnswerListWithDoctor: { method: 'GET', url: 'cmsAIQuestionnaireNew/getUserAnswerListWithDoctor', group: 'cms', dataType: 'keyValue' },
  // 获取问卷详情报表
  getTotalRecordByIdNew: { method: 'GET', url: 'cmsAIQuestionnaireNew/getTotalRecordByIdNew', group: 'cms', dataType: 'keyValue' },
  // 根据量表id获取体质详情
  getBodyDetail: { method: 'GET', url: 'cmsAIQuestionnaireNew/getBodyDetail', group: 'cms', dataType: 'keyValue' },
  // 根据授权码导出AI预测的记录列表
  exportUserAnswerByUserId: { method: 'POST', url: 'cmsAIQuestionnaireNew/exportUserAnswerByUserId', group: 'cms', dataType: 'keyValue' },
  // 疼痛问卷根据授权码导出问卷记录列表
  exportPainProjectUserAnswer: { method: 'POST', url: 'cmsAIQuestionnaireNew/exportPainProjectUserAnswer', group: 'cms', dataType: 'keyValue' },
}

export default apis

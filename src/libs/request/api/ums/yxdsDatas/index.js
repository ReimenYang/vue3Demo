const apis = {
  listYxdsDatasByType: { method: 'GET', url: 'yxdsDatas/listYxdsDatasByType', group: 'ums', dataType: 'form' },
  yxdsBannerList: { method: 'GET', url: 'yxdsDatas/yxdsBannerList', group: 'ums', dataType: 'form' },
  yxdsMemberIntegration: { method: 'GET', url: 'yxdsDatas/yxdsMemberIntegration', group: 'ums', dataType: 'form' },
  yxdsOrgIntegration: { method: 'GET', url: 'yxdsDatas/yxdsOrgIntegration', group: 'ums', dataType: 'form' },
  yxdsOrgOrMemberIntegrationDetailList: { method: 'GET', url: 'yxdsDatas/yxdsOrgOrMemberIntegrationDetailList', group: 'ums', dataType: 'form' },
  yxdsPatientIntegrationDetailList: { method: 'GET', url: 'yxdsDatas/yxdsPatientIntegrationDetailList', group: 'ums', dataType: 'form' },
}

export default apis

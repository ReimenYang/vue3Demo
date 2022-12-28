const apis = {
  checkUserJoinUnit: {
    method: 'GET',
    url: 'medicalcass/checkUserJoinUnit',
    group: 'ums',
    dataType: 'form'
  },
  checkUserReceiveElectrode: {
    method: 'POST',
    url: 'medicalcass/checkUserReceiveElectrode',
    group: 'ums',
    dataType: 'form'
  },
  doctorCheckAiPageStatus: {
    method: 'POST',
    url: 'medicalcass/doctorCheckAiPageStatus',
    group: 'ums',
    dataType: 'form'
  },
  saveUserJoinUnit: {
    method: 'POST',
    url: 'medicalcass/saveUserJoinUnit',
    group: 'ums',
    dataType: 'keyValue'
  },
  sendPatientElectrodes: {
    method: 'POST',
    url: 'medicalcass/sendPatientElectrodes',
    group: 'ums',
    dataType: 'form'
  },
  updatePayReceiveTime: {
    method: 'POST',
    url: 'medicalcass/updatePayReceiveTime',
    group: 'ums',
    dataType: 'form'
  },
  updateUserUnit: {
    method: 'POST',
    url: 'medicalcass/updateUserUnit',
    group: 'ums',
    dataType: 'json'
  },
  sendWxInformedConsent: {
    method: 'POST',
    url: 'medicalcass/sendWxInformedConsent',
    group: 'ums',
    dataType: 'keyValue'
  },
  manualJoinGroup: {
    method: 'POST',
    url: 'medicalcass/manualJoinGroup',
    group: 'ums',
    dataType: 'json'
  },
  batchManualJoinGroup: {
    method: 'POST',
    url: 'medicalcass/batchManualJoinGroup',
    group: 'ums',
    dataType: 'json'
  }
}

export default apis

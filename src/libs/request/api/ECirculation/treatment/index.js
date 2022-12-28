const apis = {
  getTreatmentData: { method: 'POST', url: 'treatment/getTreatmentData', group: 'ECirculation', dataType: 'keyValue' },
  startTreatment: { method: 'POST', url: 'treatment/startTreatment', group: 'ECirculation', dataType: 'keyValue' },
  endTreatment: { method: 'POST', url: 'treatment/endTreatment', group: 'ECirculation', dataType: 'keyValue' },
  getRecordByRecordId: { method: 'POST', url: 'treatment/getRecordByRecordId', group: 'ECirculation', dataType: 'keyValue' }
}

export default apis

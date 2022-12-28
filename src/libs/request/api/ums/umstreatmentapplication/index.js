const apis = {
  getPageStatus: {
    method: 'GET',
    url: 'umstreatmentapplication/getPageStatus',
    group: 'ums',
    dataType: 'form'
  },
  // saveTreatmentApplication: {method: "GET",url: "umstreatmentapplication/saveTreatmentApplication?userId=' + data.userId",group: "ums",dataType: "form"},
  updateTreatmentApplication: {
    method: 'GET',
    url: 'umstreatmentapplication/updateTreatmentApplication',
    group: 'ums',
    dataType: 'form'
  }
}

export default apis

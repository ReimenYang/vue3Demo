const apis = {
  pageListWorkout: {
    method: 'GET',
    url: 'consumerElectronics/pageListWorkout',
    group: 'wyjkDevice',
    dataType: 'keyValue'
  },
  viewWorkoutDetail: {
    method: 'GET',
    url: 'consumerElectronics/viewWorkoutDetail',
    group: 'wyjkDevice',
    dataType: 'keyValue'
  },
  listDeviceSurvey: {
    method: 'GET',
    url: 'consumerElectronics/listDeviceSurvey',
    group: 'wyjkDevice',
    dataType: 'keyValue'
  },
  saveOrUpdateUserTreatmentHistory: {
    method: 'POST',
    url: 'consumerElectronics/saveOrUpdateUserTreatmentHistory',
    group: 'wyjkDevice',
    dataType: 'json'
  },
  viewUthWorkout: {
    method: 'GET',
    url: 'consumerElectronics/viewUthWorkout',
    group: 'wyjkDevice',
    dataType: 'keyValue'
  },
  getUserTreatmentHistory: {
    method: 'GET',
    url: 'consumerElectronics/getUserTreatmentHistory',
    group: 'wyjkDevice',
    dataType: 'keyValue'
  },
  pageListUserTreatmentHistory: {
    method: 'GET',
    url: 'consumerElectronics/pageListUserTreatmentHistory',
    group: 'wyjkDevice',
    dataType: 'keyValue'
  }
}

export default apis

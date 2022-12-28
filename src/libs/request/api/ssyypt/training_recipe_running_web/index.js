const apis = {
  loginByStudioAuthCodeAndPassword: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/loginByStudioAuthCodeAndPassword',
    group: 'ssyypt',
    dataType: 'json'
  },
  queryStudioDeviceTotalAndOnlineNumAndMemberTotal: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryStudioDeviceTotalAndOnlineNumAndMemberTotal',
    group: 'ssyypt',
    dataType: 'json'
  },
  queryTrainRecipeRunning: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryTrainRecipeRunning',
    group: 'ssyypt',
    dataType: 'json'
  },
  queryStudioDoctorRecipeTotalNumInDays: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryStudioDoctorRecipeTotalNumInDays',
    group: 'ssyypt',
    dataType: 'json'
  },
  queryWorkoutGenderCorrelation: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryWorkoutGenderCorrelation',
    group: 'ssyypt',
    dataType: 'json'
  },
  queryStudioTrainUserSexAgeRatio: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryStudioTrainUserSexAgeRatio',
    group: 'ssyypt',
    dataType: 'formData'
  },
  queryStudioWorkoutUseNumAndDurationInDays: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryStudioWorkoutUseNumAndDurationInDays',
    group: 'ssyypt',
    dataType: 'json'
  },
  queryStartupRateUsagePeak: {
    method: 'POST',
    url: 'training_recipe_running_web/v2/queryStartupRateUsagePeak',
    group: 'ssyypt',
    dataType: 'json'
  }
}

export default apis

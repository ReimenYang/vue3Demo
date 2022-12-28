const apis = {
  signup: {
    method: 'POST',
    url: 'activiys/signup',
    group: 'core',
    dataType: 'json'
  },
  signupGame: {
    method: 'GET',
    url: 'activiys/signupGame',
    group: 'core',
    dataType: 'form'
  },
  signupGameList: {
    method: 'GET',
    url: 'activiys/signupGameList',
    group: 'core',
    dataType: 'form'
  },
  signupreview: {
    method: 'POST',
    url: 'activiys/signupreview',
    group: 'core',
    dataType: 'json'
  }
}

export default apis

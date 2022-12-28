const apis = {
  umsmemberreceiveaddress: {
    method: 'POST',
    url: 'umsmemberreceiveaddress',
    group: 'ums',
    dataType: 'json'
  },
  //   data: {method: "DELETE",url: "umsmemberreceiveaddress/ + data",group: "ums",dataType: "json"},
  page: {
    method: 'GET',
    url: 'umsmemberreceiveaddress/page',
    group: 'ums',
    dataType: 'form'
  }
}

export default apis

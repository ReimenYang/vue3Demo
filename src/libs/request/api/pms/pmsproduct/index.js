const apis = {
  // pmsproduct: {method: "GET",url: "pmsproduct/ + data",group: "pms",dataType: "form"},
  list: {
    method: 'GET',
    url: 'pmsproduct/list',
    group: 'pms',
    dataType: 'form'
  },
  productListByOftype: {
    method: 'GET',
    url: 'pmsproduct/productListByOftype',
    group: 'pms',
    dataType: 'form'
  }
}

export default apis

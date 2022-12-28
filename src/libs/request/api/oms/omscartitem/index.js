const apis = {
  // orderitem: {method: "DELETE",url: `omsorderitem/orderitem/${orderId}`,group: "oms",dataType: "json"},
  omscartitem: {
    method: 'POST',
    url: 'omscartitem',
    group: 'oms',
    dataType: 'json'
  },
  // omscartitem: {method: "DELETE",url: "omscartitem/ + data",group: "oms",dataType: "json"},
  page: {
    method: 'GET',
    url: 'omscartitem/page',
    group: 'oms',
    dataType: 'form'
  }
}

export default apis

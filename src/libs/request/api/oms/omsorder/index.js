const apis = {
  // omsorder: {method: "GET",url: `omsorder/${orderId}`,group: "oms",dataType: "form"},
  // getOrderByNo: {method: "GET",url: `omsorder/getOrderByNo/${orderNo}`,group: "oms",dataType: "form"},
  updateStatusByOrderNo: {
    method: 'POST',
    url: 'omsorder/updateStatusByOrderNo',
    group: 'oms',
    dataType: 'form'
  },
  applyResendEInvoice: {
    method: 'POST',
    url: 'omsorder/applyResendEInvoice',
    group: 'oms',
    dataType: 'form'
  },
  applySupplementInvoice: {
    method: 'POST',
    url: 'omsorder/applySupplementInvoice',
    group: 'oms',
    dataType: 'form'
  },
  // express: {method: "GET",url: "omsorder/express/ + data",group: "oms",dataType: "form"},
  mobileOrderPageQuery: {
    method: 'GET',
    url: 'omsorder/mobileOrderPageQuery',
    group: 'oms',
    dataType: 'form'
  },
  pageCoursePackageMemberVideoArticleOrder: {
    method: 'POST',
    url: 'omsorder/pageCoursePackageMemberVideoArticleOrder',
    group: 'oms',
    dataType: 'form'
  },
  weixinMpPay: {
    method: 'POST',
    url: 'omsorder/weixinMpPay',
    group: 'oms',
    dataType: 'form'
  },
  wxCreateOrder: {
    method: 'POST',
    url: 'omsorder/wxCreateOrder',
    group: 'oms',
    dataType: 'form'
  },
  orderReport: {
    method: 'GET',
    url: 'omsorder/orderReport',
    group: 'oms',
    dataType: 'keyValue'
  }
}

export default apis

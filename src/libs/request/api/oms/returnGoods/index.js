const apis = {
  applyDeviceRefundByOiidSn: {
    method: 'POST',
    url: 'returnGoods/applyDeviceRefundByOiidSn',
    group: 'oms',
    dataType: 'form'
  },
  applyReturnWithoutReason7Days: {
    method: 'POST',
    url: 'returnGoods/applyReturnWithoutReason7Days',
    group: 'oms',
    dataType: 'form'
  },
  renewalByOiidSn: {
    method: 'POST',
    url: 'returnGoods/renewalByOiidSn',
    group: 'oms',
    dataType: 'form'
  },
  returnGoodsReasonList: {
    method: 'POST',
    url: 'returnGoods/returnGoodsReasonList',
    group: 'oms',
    dataType: 'json'
  },
  returnGoodsRecordHistoryList: {
    method: 'POST',
    url: 'returnGoods/returnGoodsRecordHistoryList',
    group: 'oms',
    dataType: 'form'
  },
  returnGoodsSupplementaryInfo: {
    method: 'POST',
    url: 'returnGoods/returnGoodsSupplementaryInfo',
    group: 'oms',
    dataType: 'form'
  },
  getApplyForDepositRefundInfo: {
    method: 'GET',
    url: 'returnGoods/getApplyForDepositRefundInfo',
    group: 'oms',
    dataType: 'form'
  }
}

export default apis

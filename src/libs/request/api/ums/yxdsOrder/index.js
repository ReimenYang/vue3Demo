const apis = {
  yxdsPatientShopHomeData: { method: 'POST', url: 'yxdsOrder/yxdsPatientShopHomeData', group: 'ums', dataType: 'form' }, // 查积分和兑换数量
  yxdsPatientExchangeProduct: { method: 'POST', url: 'yxdsOrder/yxdsPatientExchangeProduct', group: 'ums', dataType: 'formData' }, // 队员兑换商品放入订单（放入购物车）
  yxdsPatientExchangePage: { method: 'POST', url: 'yxdsOrder/yxdsPatientExchangePage', group: 'ums', dataType: 'form' }, // 查看队员未提交的订单里面的商品（购物车）
  yxdsPatientCreateOrder: { method: 'POST', url: 'yxdsOrder/yxdsPatientCreateOrder', group: 'ums', dataType: 'form' }, // 队员提交订单
  yxdsOrgCreateOrder: { method: 'POST', url: 'yxdsOrder/yxdsOrgCreateOrder', group: 'ums', dataType: 'formData' }, // 战队或公会提交订单
  yxdsOrderPage: { method: 'POST', url: 'yxdsOrder/yxdsOrderPage', group: 'ums', dataType: 'form' }// 查看已提交的订单里面的商品
}

export default apis

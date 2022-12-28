import { name, appid, apiKey, apiSecret, smsKey, smsSecret } from '@/projectConfig.js'

export default async function uniCloudApi (params) {
  let data = {}
  switch (params.actionType) {
    case 'getPhoneNumber':
      data = { apiKey, apiSecret, provider: 'univerify' }
      break
    case 'sendSms':
      data = { smsKey, smsSecret }
      break
    case 'jql':
      break
  }
  // 当name=uniCloudApi时，调用uniCloud扩展库能力
  // params.apiName有值的时候，调用云函数
  let res = await uniCloud.callFunction({ name: params.apiName || 'uniCloudApi', data: { name, appid, ...params, ...data } })
  return res.result || res
}

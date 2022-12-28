import config from '@/libs/config.js'

let tools = {}

// 生成产品路径
tools.patchBuild = (projectName, params = '') => {
  if (!projectName) return console.log('项目代号不能为空')
  let hostname = config.host[config.mode]
  let port = config.webPorts[config.mode][projectName]
  if (port) port = ':' + port
  let baseUrl = config.baseUrl[projectName]
  if (baseUrl) baseUrl = '/' + baseUrl
  return hostname + port + baseUrl + params
}

export default tools

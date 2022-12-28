import libs from '@/libs'
async function getNetworkType () {
  // 检查网络是否开启
  let [error, data] = await uni.getNetworkType()
  // console.log(error, data)
  if (error) return error
  // return data.networkType
  if (data.networkType === 'none') return data.networkType
  // 校验网络是否授权并畅通
  let [_error] = await uni.request({
    'method': 'GET',
    'url': 'https://static-ec34b204-8f78-4a39-8ebd-3c4b40bf1b0a.bspapp.com/updateAppConfig.json'
  })
  return _error ? 'none' : data.networkType
}

function exitNoNotice () {
  // 判断为安卓的手机
  if (libs.data.systemInfo.platform === 'android') {
    plus.runtime.quit()
  } else {
    // 判断为ios的手机，退出App
    plus.ios.import('UIApplication').sharedApplication().performSelector('exit')
  }
}

function exitWhenAppNotReady (content = 'app即将退出') {
  uni.showToast({ title: content + ', app即将退出', duration: 5000, icon: 'none' })
  setTimeout(exitNoNotice, 5000)
}

function exit (content = 'app即将退出') {
  if (!getApp()) return exitWhenAppNotReady(content)

  uni.showModal({
    title: '关闭app提示',
    content,
    showCancel: false,
    success: res => {
      if (res.confirm) exitNoNotice()
    }
  })

}
async function initUni () {
  return {
    exit,
    exitNoNotice,
    exitWhenAppNotReady,
    networkType: await getNetworkType(),
    exitbyNetwork () {
      exit('请确认网络已经授权并通畅后重新进入')
    },
    exitbyServer () {
      exit('网络请求有误，请重新进入')
    }
  }
}
export default initUni

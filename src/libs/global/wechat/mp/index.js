let mp = {}
// #ifdef MP-WEIXIN
// let wx = require('weixin-js-sdk')
// 网页获取微信授权
mp.setAuthorize = key => {
  // 根据key获取微信授权
  // https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
  let name = {
    userLocation: '地理位置', // 使用蓝牙需要开通此权限
    userLocationBackground: '后台定位',
    record: '麦克风',
    camera: '摄像头',
    bluetooth: '蓝牙',
    writePhotosAlbum: '相册',
    addPhoneContact: '联系人',
    addPhoneCalendar: '日历',
    werun: '运动步数'
  }[key]

  uni.getSetting({
    success (res) {
      console.log('申请 ' + name + ' 授权，当前授权：', res.authSetting)
      // 已经打开返回true
      if (res.authSetting['scope.' + key] === true) return true
      // 曾被拒绝，再申请打开面板设置
      if (res.authSetting['scope.' + key] === false) {
        return uni.openSetting({
          complete (res) {
            console.log(res.authSetting)
            return res.authSetting
          }
        })
      }
      // 首次申请
      uni.authorize({
        scope: 'scope.' + key,
        success () {
          uni.showToast({ title: name + '已激活', duration: 2000, icon: 'none' })
        },
        fail () {
          uni.showToast({ title: name + '未激活', duration: 2000, icon: 'none' })
        }
      })

    }
  })
}
// #endif

export default mp

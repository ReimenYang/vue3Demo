/**
 * 对uniapp 蓝牙模块进行封装
 */
// 2
// 初始化蓝牙模块。
// 封装uni ble api
// ios下的log存在问题
import libs from '@/libs'
import project from '@/projectConfig.js'
// 蓝牙连接基类
let BaseBleModule = {}

BaseBleModule.connectTimeOut = 10 * 1000 // 连接低功耗蓝牙设备超时设置
BaseBleModule.writeTime = 100 // 控制writeBLECharacteristicValue时间间隔
BaseBleModule.tryMax = 20 // 尝试启动服务次数
// 小程序需要转为大写
// 在ble项目中是固定值
const mock = {
  consume: { // 优E康
    serviceId: '0000FFB0-0000-1000-8000-00805F9B34FB',
    characteristicId: '0000ffb2-0000-1000-8000-00805f9b34fb'
  },
  ECirculation: { // 易循环
    serviceId: '0000FFB0-0000-1000-8000-00805F9B34FB',
    // characteristicId: '0000ffb2-0000-1000-8000-00805f9b34fb'
    characteristicId: '0000FFB2-0000-1000-8000-00805F9B34FB'
  },
  deviceApp: {
    serviceId: '0000FFB0-0000-1000-8000-00805F9B34FB',
    characteristicId: '0000ffb2-0000-1000-8000-00805f9b34fb'
  },
  uniApp: {
    serviceId: '0000FFB0-0000-1000-8000-00805F9B34FB',
    characteristicId: '0000ffb2-0000-1000-8000-00805f9b34fb'
  }
}[project.projectName]
// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立连接
let deviceId = ''
// 这里的 serviceId 需要已经通过 getBLEDeviceServices 与对应设备建立连接
let serviceId = mock.serviceId //
// 这里的 characteristicId 需要已经通过 getBLEDeviceCharacteristics 与对应设备建立连接
let characteristicId = mock.characteristicId
// 写入指令队列
let commandArray = []
let platform = typeof uni !== 'undefined' && uni.getSystemInfoSync().platform

// 指令完整標記
let endFlag = true
let writeMsg = {
  200: '指令完整写入完成',
  203: '指令片段写入完成',
  204: '写入成功但状态有误', // 实行顺序有误或有失败的情况
  510: '所有指令已执行完或没有可执行的指令',
  511: '上次指令未执行完成，请稍后',
  512: '指令进入队列',
  513: '指令执行失败',
}

// 制造阻塞
function sleep (time = BaseBleModule.writeTime) { return new Promise(resolve => setTimeout(resolve, time)) }

/**
 * 用Html5+运行期环境主组件Native.js https://www.html5plus.org/doc/zh_cn/android.html
 */
let BAdapter = {
  isEnabled: () => true
}
// #ifdef APP
if (platform === 'android') {
  let main = plus.android.runtimeMainActivity()// 获取运行期环境主Activity实例对象
  let Context = plus.android.importClass('android.content.Context')// 获取所有场景类（如打电话、发短信）
  let BManager = main.getSystemService(Context.BLUETOOTH_SERVICE)
  plus.android.importClass(BManager) // 引入相关的method函数
  BAdapter = BManager.getAdapter()
  plus.android.importClass(BAdapter) // 引入相关的method函数，这样之后才会有isEnabled函数支持
}
// #endif

BaseBleModule.getDeviceId = () => deviceId
/**
 * 蓝牙状态
 */
BaseBleModule.bluetoothState = () => {
  // console.log('蓝牙状态：', BAdapter.isEnabled())
  return BAdapter.isEnabled()
}
/**
 * 打开蓝牙
 */
BaseBleModule.bluetoothOn = () => {
  return new Promise(resolve => {
    if (platform === 'ios') {
      plus.runtime.openURL(encodeURI('App-Prefs:root=Bluetooth')) // 未测试效果
      return resolve()
    }
    let res = BAdapter.enable() // res 是用户的选择
    console.log('打开蓝牙：', res, BAdapter.isEnabled())
    resolve(res)
  })
}
/**
 * 关闭蓝牙
 */
BaseBleModule.bluetoothOff = () => {
  return new Promise(resolve => {
    if (platform === 'ios') {
      plus.runtime.openURL(encodeURI('App-Prefs:root=Bluetooth')) // 未测试效果
      return resolve()
    }
    let res = BAdapter.disable()
    console.log('关闭蓝牙', res, BAdapter.isEnabled())
    resolve(res)
  })
}

// 监听蓝牙适配器状态变化事件,会执行两次，后一次才是真实状态,未启用openBluetoothAdapter，此监听依然起效
BaseBleModule.onBluetoothAdapterStateChange = typeof uni !== 'undefined' && uni.onBluetoothAdapterStateChange

/**
 * 初始化蓝牙模块
 * 其他蓝牙相关 API 必须在 uni.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。
 * 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 uni.openBluetoothAdapter 会返回错误（errCode=10001），表示手机蓝牙功能不可用。
 * 此时APP蓝牙模块已经初始化完成，可通过 uni.onBluetoothAdapterStateChange 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。
 */
BaseBleModule.openBluetoothAdapter = async () => {
  let [err, data] = await uni.openBluetoothAdapter()
  if (err) console.error('打开蓝牙服务失败', err)
  return { statusCode: err ? 500 : 200, data, err }
}

// 关闭蓝牙模块。调用该方法将断开所有已建立的连接并释放系统资源。建议在使用蓝牙流程后，与 uni.openBluetoothAdapter 成对调用
BaseBleModule.closeBluetoothAdapter = async () => {
  let [err, data] = await uni.closeBluetoothAdapter()
  if (err) console.error('蓝牙模块关闭失败', err)
  return { statusCode: err ? 500 : 200, data, err }
}

// 开始搜寻附近的蓝牙外围设备
BaseBleModule.startBluetoothDevicesDiscovery = async () => {
  let [err, data] = await uni.startBluetoothDevicesDiscovery()
  if (err) console.error('startBluetoothDevicesDiscovery fail:', err)
  return data
}

// 监听寻找到新设备的事件
BaseBleModule.onBluetoothDeviceFound = callback => {
  uni.onBluetoothDeviceFound(devices => {
    let re = JSON.parse(JSON.stringify(devices))
    for (let i = 0; i < re.devices.length; i++) {
      callback(re.devices[i])
    }
  })
}

// 停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索。
BaseBleModule.stopBluetoothDevicesDiscovery = async () => {
  let [err, data] = await uni.stopBluetoothDevicesDiscovery()
  if (err) console.error('stopBluetoothDevicesDiscovery fail:', err)
  return { statusCode: err ? 202 : 200, data, err }
}

// 连接低功耗蓝牙设备
BaseBleModule.createBLEConnection = async _deviceId => {
  let [err, data] = await uni.createBLEConnection({ deviceId: _deviceId, timeout: BaseBleModule.connectTimeOut })
  if (err) console.error('createBLEConnection fail:', err)
  if (!err) deviceId = _deviceId
  return { statusCode: err ? 502 : 200, data, err }
}

// 断开与低功耗蓝牙设备的连接。
BaseBleModule.closeBLEConnection = async () => {
  let [err, data] = await uni.closeBLEConnection({ deviceId })

  // if (!deviceId) return { statusCode: 201, data: err, err }
  // if (err) return { statusCode: 521, err }

  deviceId = ''
  // deviceId = serviceId = characteristicId = ''
  return { statusCode: 200, data, err }
}

// 获取蓝牙连接状态
BaseBleModule.getBLEConnectStatus = async () => {
  let [err, data] = await uni.getConnectedBluetoothDevices()
  if (err) console.error('getConnectedBluetoothDevices fail:', err)
  return { statusCode: err ? 520 : 200, data, err }
}

// 监听低功耗蓝牙连接状态的改变事件。包括开发者主动连接或断开连接，设备丢失，连接异常断开等等
BaseBleModule.onBLEConnectionStateChange = callback => {
  uni.onBLEConnectionStateChange(data => callback({ statusCode: data.connected ? 200 : 500, err: data, data }))
}

// 获取蓝牙设备所有服务(service)。
// 这里获取serviceId
BaseBleModule.getBLEDeviceServices = async (n = 0) => {
  if (n > BaseBleModule.tryMax) return { statusCode: 502, err: 'getBLEDeviceServices 启动失败' }
  await sleep(1000)
  let [err, _data] = await uni.getBLEDeviceServices({ deviceId })
  // ble 有这个服务，但返回了空数据:{"services":[],"errMsg":"getBLEDeviceServices:ok"}
  // 部分手机在调用getBLEDeviceServices方法前加入10秒阻塞可以获取到
  // 获取到的UUID可以有很多，功能不尽相同，只做提示，不会实际调用，具体应用需要跟硬件厂家沟通
  if (err) {
    console.error('getBLEDeviceServices fail:', err)
    return { statusCode: 502, err }
  }
  console.info('getBLEDeviceServices:', _data, err, n)
  if (!_data.services.length) return BaseBleModule.getBLEDeviceServices(n + 1)
  let data = serviceId = mock.serviceId
  return { statusCode: 200, data }
}

// 获取蓝牙设备某个服务中所有特征值(characteristic)。
// 这里的获取characteristicId
BaseBleModule.getBLEDeviceCharacteristics = async (n = 0) => {
  if (n > BaseBleModule.tryMax) return { statusCode: 503, err: 'getBLEDeviceServices 启动失败' }
  await sleep(1000)
  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立连接
  let [err, _data] = await uni.getBLEDeviceCharacteristics({ deviceId, serviceId })
  // ble serviceUUID错误会报没有这个服务，导致api报错：10004	no service	没有找到指定服务
  // [undefined, { "errMsg": "getBLEDeviceCharacteristics:fail no service", "errCode": 10004, "code": 10004 }]
  // 部分手机在调用getBLEDeviceServices方法前加入10秒阻塞可以获取到
  // 获取到的UUID可以有很多，功能不尽相同，只做提示，不会实际调用，具体应用需要跟硬件厂家沟通
  if (err) {
    console.error('getBLEDeviceCharacteristics fail:', err)
    return { statusCode: 503, err }
  }
  console.info('getBLEDeviceCharacteristics:', _data, err, n)
  if (!_data.characteristics.length) return BaseBleModule.getBLEDeviceCharacteristics(n + 1)
  let data = characteristicId = mock.characteristicId
  return { statusCode: 200, data }
}

// 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
// 注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
// 另外，必须先启用 notifyBLECharacteristicValueChange 才能监听到设备 characteristicValueChange 事件
BaseBleModule.notifyBLECharacteristicValueChange = async () => {
  console.log(deviceId, serviceId, characteristicId)
  let [err, data] = await uni.notifyBLECharacteristicValueChange({ state: true, deviceId, serviceId, characteristicId })
  if (err) console.error('notifyBLECharacteristicValueChange', err)
  return { statusCode: err ? 504 : 200, data, err }
  // return new Promise(resolve => {
  //   uni.notifyBLECharacteristicValueChange({
  //     state: true, // 启用 notify 功能
  //     // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立连接
  //     deviceId,
  //     serviceId,
  //     characteristicId,
  //     success: (data) => {
  //       // console.log('notifyBLECharacteristicValueChange success:', JSON.stringify(data))
  //       resolve({ statusCode: 200, data })
  //     },
  //     fail: (err => {
  //       console.log('notifyBLECharacteristicValueChange fail:', err)
  //       resolve({ statusCode: 504, err })
  //     })
  //   })
  // })
}

// 监听低功耗蓝牙设备的特征值变化事件。
// 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification
BaseBleModule.onBLECharacteristicValueChange = (callback) => {
  return uni.onBLECharacteristicValueChange(data => callback(data))
}

// 指令切割器
BaseBleModule.commandSplit = (str, leng = 20) => {
  let arr = []
  let index = 0
  while (index < str.length) {
    arr.push(str.slice(index, index += leng))
  }
  return arr
}

// 指令执行历史
BaseBleModule.commandHistory = []

// 设置指令执行历史
let setCommandHistory = (id, statusCode, msg) => {
  let commandHistory = BaseBleModule.commandHistory.find(item => item.id === id)
  commandHistory.statusCode = statusCode
  commandHistory.msg = msg

  let globalData = libs.configProject.globalData
  // console.log('完成指令', commandHistory)
  // if (!globalData.log) globalData.log = []
  // globalData.log.push('完成指令' + JSON.stringify(commandHistory) + '\r\n\0')

  if (!globalData.commandListener) globalData.commandListener = {}
  let listener = globalData.commandListener[id]
  if (!listener) return
  return listener(commandHistory)
}

// 指令状态监听器
/**
 * 指令状态监听器(commandListener)和订阅消息(setEventBus)的不同
 * commandListener只能处理通讯层面指令发送是否成功的通知回调；
 * setEventBus可以处理设备返回的通讯及业务的通知回调
 * commandListener知道所有指令的发出状态，不知道返回的内容；
 * setEventBus根据设备返回的数据进行分类通知，因此对不同指令返回相同数据的回调无法处理
 *
 */
// 设置指令发送完的callback
BaseBleModule.commandCallback = (id, fun, once = true) => {
  if (!id || typeof fun !== 'function') return console.error('设置指令发送完的callback有误', id, fun)
  let globalData = libs.configProject.globalData
  if (!globalData.commandListener) globalData.commandListener = {}
  globalData.commandListener[id] = async data => {
    await fun(data)
    if (once) delete globalData.commandListener[id]
  }
}

// 指令队列执行方法
BaseBleModule.commandMQ = (command) => {
  let statusCode = 512
  let commandObj = { id: new Date().valueOf(), command, statusCode, msg: writeMsg[statusCode] }
  commandArray.push(commandObj)
  commandArray.sort((a, b) => a.id - b.id)
  BaseBleModule.commandHistory.push(commandObj)
  BaseBleModule.commandHistory.sort((a, b) => a.id - b.id)
  // console.log('收到指令', command, commandArray)
  return BaseBleModule.writeBLECharacteristicValue(commandObj)
}

// 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用。
// 因为每次写入不超过20字节，所以做了分包处理https://www.jianshu.com/p/6e89e73b92a8
BaseBleModule.writeBLECharacteristicValue = async commandObj => {
  let statusCode, err
  if (endFlag !== true) {
    statusCode = 511// 'busy'
    err = writeMsg[statusCode]
    setCommandHistory(commandObj.id, statusCode, err)
    return { statusCode, err, data: { commandObj, commandArray, commandHistory: BaseBleModule.commandHistory } }
  }

  let { id, command } = commandArray[0]
  if (!command) {
    statusCode = 205// 'empty'
    err = writeMsg[statusCode]
    console.error(err)
    setCommandHistory(id, statusCode, err)
    return { statusCode, err }
  }

  // console.log('写入指令', command, commandArray)
  // 指令切割数据
  let commandArr = BaseBleModule.commandSplit(command + '\r\n\0')
  // 按指令切割数据，把每个切割后的数据的每个字母转换为二进制

  // 转换后的二进制队列，为发送使用
  let splitList = commandArr.map(str => {
    let buffer = new ArrayBuffer(str.length)
    let dataView = new DataView(buffer)
    for (let i = 0; i < str.length; i++) {
      // charAt()对于生僻字可能会产生错误，可参考使用codePointAt()
      // https://es6.ruanyifeng.com/#docs/string-methods#实例方法：codePointAt
      dataView.setUint8(i, str.charAt(i).charCodeAt())
    }
    return dataView.buffer
  })

  // 按二进制队列发送指令，间隔100毫秒
  endFlag = splitList.length - 1
  for (let i = 0; i < splitList.length; i++) {
    let value = splitList[i]
    // 向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用。
    // deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
    // value是ArrayBuffer类型

    // ios 没有回调
    if (platform === 'ios') {
      uni.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, value })
      await sleep()
      if (i === endFlag) return BaseBleModule.writeSuccess()
    } else {
      let [err] = await uni.writeBLECharacteristicValue({ deviceId, serviceId, characteristicId, value })
      await sleep()
      if (err) {
        console.error('写入失败', command, err)
        commandArray = []
        endFlag = true
        statusCode = 513// 'fail'
        err = writeMsg[statusCode] + command + JSON.stringify(err)
        console.log(command, err)
        setCommandHistory(id, statusCode, err)
        return { statusCode, err }
      }
      // if (platform === 'ios' && i === endFlag) return BaseBleModule.writeSuccess()
      if (i === endFlag) return BaseBleModule.writeSuccess()
    }
  }
}
// writeBLECharacteristicValue成功的动作
BaseBleModule.writeSuccess = () => {
  endFlag = true
  // 切割指令队列第一个并返回
  let commandFinish = commandArray.shift()
  setCommandHistory(commandFinish.id, 200, '完成指令')
  // if (!commandFinish.command.startsWith('DATA:k')) console.log('完成指令', commandFinish.command)
  if (commandArray.length > 0) BaseBleModule.writeBLECharacteristicValue()
  // 抛出完成指令的结果
  return { statusCode: 200, data: commandFinish }
}


export default BaseBleModule

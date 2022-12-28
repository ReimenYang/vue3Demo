/**
 *
 * 4
 * 事件总线通知类
 */
export default class EventBus {
  static TAG = 'EventBus' // 事件标识
  static ADD_DEVICE_SUCCESS = 'add_device_success'// /添加设备成功
  static DELETE_DEVICE_SUCCESS = 'delete_device_success'// /删除设备成功
  static UPDATE_DEVICE_SUCCESS = 'update_device_success'// /更新设备成功
  // static BLE_DEVICE_DISCONNECTED = 'ble_device_disconnected'// 蓝牙设备断开连接,BREAK_CONNECT代替
  // static BLE_DEVICE_CONNECTED = 'ble_device_connected'// 蓝牙设备连接成功,CONNECTED代替
  // static BLE_GET_DEIVCE_SERIALNO = 'ble_get_deivce_serialno'// 蓝牙获取到serialno,GET_SERIALNO代替
  // static BLE_GET_DEIVCE_STATUS = 'ble_get_deivce_status'// 蓝牙获取到设备数据,LONG_RECIVED代替
  static ADD_PATIENT_SUCCESS = 'add_patient_success'// 添加患者成功
  static EDIT_PATIENT_SUCCESS = 'edit_patient_success'// 编辑患者成功
  static DELETE_PATIENT_SUCCESS = 'delete_patient_success'// 删除患者成功
  /**
     * 工作顺序：
     * 参数设置——打开蓝牙模块——检查手机蓝牙开关状态——搜索设备——连接设备——配对设备——给设备发送工作指令
     */
  /**
   * 蓝牙api是否完成初始化，对应openBluetoothAdapter
   */
  static BLE_READY = 'bleReady'// 框架完成初始化
  static BLE_UNREADY = 'bleUnready'// 框架未完成初始化
  /**
   * 手机蓝牙是否处于打开状态,对应getBLEConnectStatus
   */
  static BLE_ONLINE = 'bleOnline'// 手机蓝牙已打开
  static BLE_OFFLINE = 'bleOffline'// 手机蓝牙未打开
  /**
   * 是否在搜索蓝牙设备，对应startBluetoothDevicesDiscovery
   */
  static SEARCH_START = 'searchStart'// 搜索蓝牙设备开始
  static SEARCH_BINGO = 'searchBingo'// 每搜到一个蓝牙设备回调一次
  static SEARCH_END = 'searchEnd'// 搜索蓝牙设备结束
  /**
   * 连接设备（connected）：手机是否与设备对接上，并成功开启了数据交互监听,可以发指令，对应createBLEConnection
   */
  static CONNECTING = 'connecting'// 连接中
  static CONNECTED = 'connected'// 连接成功
  static CONNECT_FAIL = 'connectFail'// 连接失败
  static CONNECT_BREAK = 'connectBreak'// 设备断开连接
  static CONNECT_CLOSE = 'connectClose'// 主动断开连接
  /**
   * 配对设备（paired）：手机是否与设备配对上，执行完获取设备信息指令，并按一定的业务规则进行判断，符合联机条件，处于pbt状态
   */
  static PAIRING = 'pairing'// 配对中
  static PAIR_FAIL = 'pairFail'// 设备配对失败
  static PAIR_BREAK = 'pairBreak'// 设备配对断开
  static PAIRED = 'paired'// 设备配对成功

  static SET_INIT = 'setInit'// 初始命令发送成功
  static COMMAND_FAIL = 'commandFail'// 指令发送失败

  static LONG_RECIVED = 'longRecived'// 手机与设备之间的连接断开长连接心跳包
  static SET_CURRENT = 'setCurrent'// 设置电流强度
  static GET_SERIALNO = 'getSerialno'// 设备序列号数据，蓝牙连接成功后只回调一次
  static GET_RECORD = 'getRecord'// 获取硬件的最后一个训练程序的状态

  static logMsg = {
    bleReady: {
      log: '完成初始化',
      // toast: '完成初始化',
      stateName: 'bleReady',
      state: true
    },
    bleUnready: {
      log: '未完成初始化',
      toast: '未完成初始化',
      stateName: 'bleReady',
      state: false
    },
    bleOnline: {
      log: '手机蓝牙已打开',
      // toast: '手机蓝牙已打开',
      stateName: 'bleOnline',
      state: true
    },
    bleOffline: {
      log: '手机蓝牙未打开',
      toast: '手机蓝牙未打开',
      stateName: 'bleOnline',
      state: false
    },
    searchStart: {
      log: '搜索蓝牙设备开始',
      toast: '搜索蓝牙设备开始',
      stateName: 'searching',
      state: true
    },
    searchBingo: {
      log: '搜到蓝牙设备'
    },
    searchEnd: {
      log: '搜索蓝牙设备结束',
      toast: '搜索蓝牙设备结束',
      stateName: 'searching',
      state: false
    },
    connecting: {
      log: '连接中...',
      toast: '连接中...',
      time: 10 * 1000,
      icon: 'loading',
      stateName: 'connected',
      state: false
    },
    connected: {
      log: '连接成功',
      toast: '连接成功',
      stateName: 'connected',
      state: true
    },
    connectFail: {
      log: '连接失败',
      toast: '连接失败',
      stateName: 'connected',
      state: false
    },
    connectBreak: {
      log: '设备断开连接',
      toast: '设备断开连接',
      stateName: 'bleOnline',
      state: false
    },
    connectClose: {
      log: '主动断开连接',
      toast: '主动断开连接',
      stateName: 'bleOnline',
      state: false
    },
    pairing: {
      log: '配对中...',
      toast: '配对中...',
      time: 10 * 1000,
      icon: 'loading',
      stateName: 'paired',
      state: false
    },
    pairFail: {
      log: '设备配对失败',
      toast: '设备配对失败',
      stateName: 'connected',
      state: false
    },
    pairBreak: {
      log: '设备配对断开',
      toast: '设备配对断开',
      stateName: 'connected',
      state: false
    },
    paired: {
      log: '设备配对成功',
      toast: '设备配对成功',
      stateName: 'paired',
      state: true
    },
    setInit: {
      log: '初始命令发送成功',
      stateName: 'devicesReady',
      state: true
    },
    commandFail: {
      log: '指令发送失败'
    },
    longRecived: {
      log: '心跳包'
    },
    setCurrent: {
      log: '设置电流强度'
    },
    getSerialno: {
      log: '设备序列号数据'
    },
    getRecord: {
      log: '程序的状态'
    }
  }

  // eslint-disable-next-line space-before-function-paren
  constructor(msgCode, data) {
    this.msgCode = msgCode
    this.data = data
  }

  static register (callback) {
    uni.$on(EventBus.TAG, callback)
  }

  static unregister (callback) {
    uni.$off(EventBus.TAG, callback)
  }

  static post (event) {
    uni.$emit(EventBus.TAG, event)
  }
}

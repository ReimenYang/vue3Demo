export default {
  data () {
    let {
      bleReady, // 蓝牙api是否完成初始化
      bleOnline, // 手机蓝牙是否处于可连接状态
      searching, // 是否在搜索蓝牙设备
      connected, // 手机是否与设备对接上,可以发指令
      paired, // 手机是否与设备配对上，已经发送c指令，处于pbt状态
      devicesReady // 初始化指令是否发送成功，设备处于可开始状态
    } = this.globalData
    return {
      BioStimBleModule: this.libs.global.ble.BioStimBleModule,
      EventBus: this.libs.global.ble.EventBus,
      eventBusCallBack: () => console.log('eventBusCallBack'),
      log: [],
      device: this.libs.data.getStorage('device'),
      longRecived: {},
      workTime: 60, // 单位：秒
      bleReady, // 蓝牙api是否完成初始化，对应openBluetoothAdapter
      bleOnline, // 手机蓝牙是否处于可连接状态,对应getBLEConnectStatus
      searching, // 是否在搜索蓝牙设备，对应startBluetoothDevicesDiscovery
      connected, // 手机是否与设备对接上，并成功开启了数据交互监听,可以发指令，对应createBLEConnection
      paired, // 手机是否与设备配对上，执行完获取设备信息指令，并按一定的业务规则进行判断，符合联机条件，处于pbt状态
      devicesReady // 初始化指令是否发送成功，设备处于可开始状态
    }
  },
  async onShow () {
    this.paired = this.globalData.paired
    this.device = this.libs.data.getStorage('device')
    // },
    // async onLoad () {
    this.globalData.log = this.log
    // 避免重复激活服务
    if (!this.globalData.bleReady) {
      // 注册蓝牙改变全局监听事件,全局基础服务，千万不能重复注册
      if (!this.globalData.bleStateChange) this.bleStateChangeRegister()
      if (this.globalData.workout) this.workTime = this.globalData.workout.duration
      this.setEventBus()
      await this.bleInit()
    }
    this.pageInit()
  },
  methods: {
    // 注册蓝牙改变全局监听事件
    async bleStateChangeRegister () {
      console.log('注册蓝牙改变全局监听事件')
      // let _this = this
      this.globalData.bleStateChange = {
        // discoveringFalse: { console () { console.log('关闭发现') } },
        // discoveringTrue: { console () { console.log('开启发现') } },
        availableFalse: {
          // console () {
          //   console.log('关闭蓝牙')
          // },
          closeBluetoothAdapter () {
            // console.log('蓝牙不可链接')
            // 蓝牙已经关闭，次数执行closeBluetoothAdapter一定报错(10001)
            // this.BioStimBleModule.closeBluetoothAdapter()
          }
        },
        availableTrue: {
          // console () {
          //   console.log('开启蓝牙')
          // },
          async openBluetoothAdapter (res) {
            console.log('蓝牙空闲，可连接', res)
            // if (_this.globalData.bleReady) await _this.BioStimBleModule.closeBluetoothAdapter()
            // await _this.bleInit()
          }
        }
      }
      this.BioStimBleModule.onBluetoothAdapterStateChange()
    },
    // 执行蓝牙改变事件
    async bleStateChangeAction (res) {
      if (!Object.keys(res).includes('available')) return
      // let discoverEven = this.globalData.bleStateChange[res.discovering ? 'discoveringTrue' : 'discoveringFalse']
      // if (discoverEven) Object.keys(discoverEven).forEach(key => discoverEven[key](res))

      let availableEven = this.globalData.bleStateChange[res.available ? 'availableTrue' : 'availableFalse']
      if (availableEven) Object.keys(availableEven).forEach(key => availableEven[key](res))
    },
    async stateManage (target, msgCode) {
      let { log, toast, stateName, state, time = 2000, icon = 'none' } = target
      if (typeof state !== 'boolean' || this[stateName] === state) return
      // 操作当前状态
      this[stateName] = this.globalData[stateName] = state
      if (stateName !== 'searching' && !state) {
        // 状态顺序，搜索状态与其他状态的关系需要注意
        let stateList = ['bleReady', 'bleOnline',
          // 'searching',
          'connected', 'paired', 'devicesReady']
        // 操作后续状态
        stateList.slice(stateList.indexOf(stateName) + 1).forEach(_state => {
          this[_state] = this.globalData[_state] = false
        })
      }
      if (toast) this.toast(toast, time, icon)
      console.log(
        '触发来源', msgCode,
        '操作状态', log, stateName,
        'bleReady', this.globalData.bleReady,
        'bleOnline', this.globalData.bleOnline,
        'searching', this.globalData.searching,
        'connected', this.globalData.connected,
        'paired', this.globalData.paired,
        'devicesReady', this.globalData.devicesReady
      )
    },
    async bleInit () {
      /**
   * 初始化蓝牙模块
   * 其他蓝牙相关 API 必须在 uni.openBluetoothAdapter 调用之后使用。否则 API 会返回错误（errCode=10000）。
   * 在用户蓝牙开关未开启或者手机不支持蓝牙功能的情况下，调用 uni.openBluetoothAdapter 会返回错误（errCode=10001），表示手机蓝牙功能不可用。
   * 此时APP蓝牙模块已经初始化完成，可通过 uni.onBluetoothAdapterStateChange 监听手机蓝牙状态的改变，也可以调用蓝牙模块的所有API。
   * 工作顺序：
   * 参数设置——打开蓝牙模块——检查手机蓝牙开关状态——搜索设备——连接设备——配对设备——给设备发送工作指令
   * 连接设备：指执行了createBLEConnection，并成功开启了数据交互监听
   * 配对设备：执行完获取设备信息指令，并按一定的业务规则进行判断，符合联机条件
   */
      await this.BioStimBleModule.openBluetoothAdapter()

      // 检查蓝牙是否可连接
      if (this.globalData.bleReady) await this.BioStimBleModule.getBLEConnectStatus()
    },
    async pageInit () {
      if (this.init) return this.init()
    },
    getPageUrl () {
      return getCurrentPages()[getCurrentPages().length - 1].route
    },
    reLaunchIndex (from) {
      console.log(from)
    },
    // 设置回调事件
    setEventBus () {
      this.eventBusCallBack = async res => {
        let { msgCode, data = {} } = res
        let logMsg = this.EventBus.logMsg[msgCode]
        let toast = logMsg.toast
        // 1.将本次事件处理完成
        switch (msgCode) {
          case this.EventBus.BLE_UNREADY: // 框架未完成初始化
            if (data.statusCode === 500 && data.err.errCode === 10001) {
              toast += ',请检查手机蓝牙是否打开'
              toast += data.err.errCode
            }
            break
          case this.EventBus.CONNECT_FAIL: // 设备链接失败
          case this.EventBus.CONNECT_BREAK: // 被动断开链接
          case this.EventBus.PAIR_FAIL: // 设备配对失败
          case this.EventBus.PAIR_BREAK: // 设备配对断开
            if (data.statusCode === 501) {
              if (data.err.errCode === 10012 || data.err.errCode === 10013) toast += ',请检查设备是否开机'
              toast += data.err.errCode
            }
            break
          case this.EventBus.GET_SERIALNO: // 设备序列号数据，蓝牙连接成功后只回调一次
            this.globalData.deviceInfo = data
            break
          case this.EventBus.GET_RECORD: // 获取治疗记录
            this.globalData.record = data
            break
        }
        // 2.处理状态
        await this.stateManage({ ...logMsg, toast }, msgCode, data)
        // 3.执行后续相关动作
        switch (msgCode) {
          case this.EventBus.BLE_UNREADY: // 框架未完成初始化
            setTimeout(this.libs.data.exit, 2000)
            break
          case this.EventBus.BLE_ONLINE: // 手机蓝牙已打开
          case this.EventBus.BLE_OFFLINE: // 手机蓝牙未打开
            await this.bleStateChangeAction(data)
            break
          case this.EventBus.CONNECT_FAIL: // 设备链接失败
          case this.EventBus.CONNECT_BREAK: // 被动断开链接
          case this.EventBus.PAIR_FAIL: // 设备配对失败
          case this.EventBus.PAIR_BREAK: // 设备配对断开
            if (data.statusCode === 504) {
              toast += ',启用订阅失败,请退出并在5秒后重启APP'
              toast += data.err.errCode
              uni.showModal({
                title: toast,
                showCancel: false,
                success: res => res.confirm && this.libs.data.exit()
              })
              return
            }
            // if (logMsg.stateName === 'paired') await this.closeBLEConnection()
            this.reLaunchIndex('connect_close')
            break
          case this.EventBus.GET_SERIALNO: // 设备序列号数据，蓝牙连接成功后只回调一次
            // case this.EventBus.CONNECTED: // 链接成功
            // 使用GET_SERIALNO的逻辑会更严谨，但由于有时候收不到反馈，只能用CONNECTED代替
            console.log('设备序列号数据，蓝牙连接成功后只回调一次', this.globalData.isNewDevice)
            if (this.globalData.isNewDevice === 'N') await this.createPaired()
            // 如果是优E康，检查治疗记录
            if (this.globalData.isNewDevice === 'Y') await this.getRecord()
            break
          case this.EventBus.PAIRED: // 设备配对成功
            this.handlePair(data)
            break
          case this.EventBus.GET_RECORD: // 获取治疗记录
            console.log('显示获取治疗记录', this.globalData.paired, data, this.getPageUrl())
            // 如果未配对，启动配对
            if (!this.globalData.paired) await this.createPaired()
            await this.handleRecord(data)
            break
          case this.EventBus.LONG_RECIVED: // 长连接心跳包
            // console.log('长连接心跳包', msgCode, data, this.handleLongRecived)
            await this.handleLongRecived(data)
            break
        }
      }
      this.EventBus.register(this.eventBusCallBack)
    },
    handlePair (data) {
      console.log('设备配对成功')
      let _page = this.getPageUrl()
      switch (_page) {
        case 'pages/bluetooth/connect':
          this.globalData.handlePair(data)
          break
      }
    },
    async handleRecord (data) {
      let _page = this.getPageUrl()
      let { recordId, totalTime, time, isStop } = this.globalData.workoutRecord = data
      console.log('获取r指令', data, _page, recordId, totalTime, time, isStop)
      clearInterval(this.globalData.loopRecord)
      // if (!recordId && _page === 'pages/bluetooth/setCurrent') return
      if (!recordId) return

      // this.globalData.workoutRecord = (await this.libs.request(this.libs.api.wyjkDevice.consumerElectronics.getUserTreatmentHistory, { userTreatmentHistoryId: recordId })).data
      // console.log('治疗记录', this.globalData.workoutRecord)


      // 未结束
      if (isStop === '0') {
        console.log('未结束', isStop, !isStop)
        // if (!this.globalData.workout) {
        //   let _workout = this.workoutList.find(item => item.workoutId === this.globalData.workoutRecord.workoutId)
        //   if (!_workout) return this.toast('找不到记录对应的治疗方案')
        //   this.globalData.workout = JSON.parse(JSON.stringify(_workout))
        // }

        // this.globalData.workout.duration = totalTime || this.workTime
        // this.globalData.workout.time = time || 0
        // console.log('治疗方案', this.globalData.workout)

        // switch (_page) {
        // case 'pages/bluetooth/running':
        // if (this.globalData.handleRecord) await this.globalData.handleRecord(data)
        // break
        // default:
        // uni.reLaunch({ url: '/pages/bluetooth/running' })
        // }
        return
      }

      // 已结束
      // if (isStop === '1') {
      console.log('已结束', isStop, !isStop)
      this.globalData.workoutRecord.isStop = isStop
      this.globalData.workoutRecord.endDateTime = this.libs.data.dateNow(this.libs.data.dateIOSFormat(this.globalData.workoutRecord.startDateTime) + parseFloat(time) * 1000)
      // 这个地方有歧义，未结束的会显示设置的治疗时长，已结束的会显示实际治疗时长
      this.globalData.workoutRecord.duration = time
      console.log('治疗结束，更新治疗记录', this.globalData.workoutRecord)
      // let _res = await this.libs.request(this.libs.api.wyjkDevice.consumerElectronics.saveOrUpdateUserTreatmentHistory, this.globalData.workoutRecord)
      // if (_res) this.clearRecord()

      // let whithPage = ['pages/scheme/index', 'pages/bluetooth/setCurrent']
      // let whithPage = ['pages/scheme/index']
      // if (!whithPage.includes(_page)) uni.reLaunch({ url: '/pages/scheme/index?from=' + _page.split('/').slice(-1).join() })
      // return
      // }
    },
    async handleLongRecived (data) {
      let isFall = await this.isFall()
      this.globalData.deviceState = { ...data, isFall }
      // let { count, numPhase, intensityCHL, intensityCHR, bat, stateRunning, statePhase, remainingTime, wavepercent, settingCHL, settingCHR, stateCHL, stateCHR, sum } = data
      // console.log(
      //   '当前阶段', numPhase,
      //   '当前左强度', intensityCHL / 10,
      //   '当前右强度', intensityCHR / 10,
      //   '运行状态', { '0': '设置', '1': '运行', '2': '暂停', '3': '停止', '4': '锁定' }[stateRunning],
      //   '阶段状态', { '1': '上升', '2': '平台', '3': '下降', '4': '休息', '5': '调整刺激强度', '6': '输出开路', '7': '治疗完成' }[statePhase],
      //   '阶段1左强度', settingCHL / 10,
      //   '阶段1右强度', settingCHR / 10,
      //   '左贴片', { '1': '治疗中', '2': '脱落' }[stateCHL],
      //   '右贴片', { '1': '治疗中', '2': '脱落' }[stateCHR],
      //   '跌落判断', isFall,
      //   this.getPageUrl()
      // )
      // switch (this.getPageUrl()) {
      //   case 'pages/bluetooth/running':
      //   case 'pages/bluetooth/setCurrent':
      // if (data.stateRunning==='3'||data.stateRunning==='4'){
      // 		this.endTreatment()
      // 		this.reLaunchIndex()
      // }
      if (this.globalData.handleLongRecived) await this.globalData.handleLongRecived(data)
      //     break
      // }
    },
    async isFall () {
      if (!this.globalData.deviceState) return ''
      let { statePhase, stateCHL } = this.globalData.deviceState
      // stateRunning 运行状态，可以是: 0 设置 ，1 运行，2 暂停，3 停止，4 锁定
      // 停止倒计时：设置，暂停，停止
      // 不可调电：暂停，停止，锁定
      // 判断跌落：设置，运行
      // 判断输出开路
      let _isFall = statePhase === '6' ? 'fall' : ''
      if (_isFall) _isFall = stateCHL !== '1' ? 'left' : 'right'
      return _isFall
    },
    // 搜索设备
    async bleSearch () {
      if (this.globalData.searching) return
      this.BioStimBleModule.startBluetoothDevicesDiscovery()
    },
    // 停止搜索
    stopSearch () {
      return this.BioStimBleModule.stopBluetoothDevicesDiscovery()
    },
    // 选择设备
    selectDevice (item) {
      if (item.isCheck) return
      // 这里必须用$set
      this.BioStimBleModule.deviceList.forEach(obj => { this.$set(obj, 'isCheck', obj.deviceId === item.deviceId) })
      this.device = item
    },
    // 连接设备
    async connectDevice () {
      // 检查初始化状态，可能会与监听事件产生时机问题
      // 未初始化，注册打开后自动执行的事件
      if (!this.globalData.bleReady) {
        this.globalData.bleStateChange.availableTrue.connectDevice = this.connectDevice
        return
      }
      // 如果在搜索就停止搜索
      if (this.globalData.searching) await this.stopSearch()
      // 如果在连接或者已经连接，断开原来的连接
      if (this.globalData.connected) await this.closeBLEConnection()

      delete this.globalData.bleStateChange.availableTrue.connectDevice
      console.log('连接设备', this.device)
      let _connected = await this.BioStimBleModule.createBLEConnection(this.device.uuid)
      uni.hideLoading()
      // 执行配对
      return _connected
    },
    // 尝试配对
    createPaired () {
      return this.BioStimBleModule.createPaired(this.pairedRule)
    },
    // 配对规则
    async pairedRule () {
      // console.log('配对设备', this.globalData.deviceInfo, this.globalData.record)
      // // 旧设备
      // if (this.globalData.deviceInfo.version === '0') return true
      // let { recordId, isStop } = this.globalData.record
      // // 没有记录
      // if (!recordId || isStop === '1') return true
      // let workoutRecord = (await this.libs.request(this.libs.api.wyjkDevice.consumerElectronics.getUserTreatmentHistory, { userTreatmentHistoryId: recordId })).data
      // // 判断是否当前用户
      // console.log(workoutRecord, this.globalData.userInfo.id)
      // return workoutRecord.userId === this.globalData.userInfo.id
      return true
    },
    // 设置时长
    setWorkTime (time) {
      this.workTime = time * 60
    },
    // 发送初始命令
    async sendInitCmd () {
      // 临时数据处理？？
      let phaseList = this.globalData.workout.workoutphaselist || this.globalData.workout.phaseList || this.globalData.workout.workoutPhaseList[0]
      let options = { ...this.globalData.workout, ...phaseList }
      console.log('发送初始命令', options, this.workTime)
      let MCommand = options.initcommand || options.initCommand
      let PCommand = options.workoutphaselist || options.phaseList || options.workoutPhaseList
      if (!MCommand || !PCommand) return this.toast('程序初始化指令错误！')
      return this.BioStimBleModule.sendInitCmd(options, this.workTime)
    },
    // 左减电
    async leftMinus (channel) {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.leftMinus(channel)
    },
    // 左加电
    leftPlus (channel) {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.leftPlus(channel)
    },
    // 右减电
    rightMinus (channel) {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.rightMinus(channel)
    },
    // 右加电
    rightPlus (channel) {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.rightPlus(channel)
    },
    // 左设电
    leftValue (channel, value) {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.leftValue(channel, value)
    },
    // 右设电
    rightValue (channel, value) {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.rightValue(channel, value)
    },
    // 下阶段
    nextPhase (channel) {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.nextPhase(channel)
    },
    // 开始治疗
    startTreatment (channel, command = '') {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.startTreatment({ command, channel })
    },
    // 暂停治
    pauseTreatment (channel, command = '') {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.pauseTreatment({ command, channel })
    },
    // 结束治疗
    endTreatment (channel, command = '') {
      if (this.globalData.isNewDevice === 'Y' && !channel) channel = 255
      return this.BioStimBleModule.endTreatment({ command, channel })
    },
    // 断开连接
    closeBLEConnection () {
      return this.BioStimBleModule.closeBLEConnection()
    },
    // 设置记录
    setRecord (recordId) {
      return this.BioStimBleModule.setRecord(recordId)
    },
    // 获取记录
    getRecord () {
      return this.BioStimBleModule.getRecord()
    },
    // 清除记录
    clearRecord () {
      return this.BioStimBleModule.clearRecord()
    },
    // 指令历史
    commandHistory () {
      return this.BioStimBleModule.commandHistory
    },
    // 设置指令发送完的callback
    commandCallback (id, fun, once) {
      return this.BioStimBleModule.commandCallback(id, fun, once)
    }
  }
}

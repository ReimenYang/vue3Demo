/**
 * 杉山ble训练仪指令校验器
 *
 * 3
 * 对设备回调信息进行分类处理
 * 基本思路：
 * 1.由BioStimBleModule接收设备返回的消息
 * 2.传入BTSResponseModule进行分类处理
 * 3.对于有触发事件总线通知类（EventBus）的发出通知
 *
 * ios下的log存在问题
 */

import EventBus from './EventBus.js'
import libs from '@/libs'

export class BTSResponseModule {
  // eslint-disable-next-line space-before-function-paren
  constructor(statusPages) {
    let msgCodeList = {
      ACK: {
        c: EventBus.GET_SERIALNO,
        r: EventBus.GET_RECORD,
        e: EventBus.SET_INIT// 多通道有问题
      },
      DATA: {
        s: EventBus.LONG_RECIVED,
        r: EventBus.GET_RECORD,
        k: EventBus.SET_CURRENT,
        c: EventBus.GET_SERIALNO
      }
    }
    this.data = {}
    this.data.rawData = statusPages

    // 检验并对包进行封装 ACK（或ERR:）与\r\n\0之间可携带数据，有待定义
    let [key, ...data] = statusPages.split(':')
    this.data.isFullPackage = key.startsWith('ACK') || key.startsWith('ERR')
    let [type, ...option] = data[0].split(',')
    // ack指令不转义再转回来会出现看上去相等，实际不相等的情况，如type看上去是'r'，type==='r'报false
    type = String.fromCharCode(type.charCodeAt())

    // 过滤这些反馈发log
    let logFilter = ['s', 'k']
    let hideLog = logFilter.includes(type)
    if (!hideLog) {
      console.log('收到反馈：', statusPages)
      if (!libs.configProject.globalData.log) libs.configProject.globalData.log = []
      libs.configProject.globalData.log.push('收到反馈：' + statusPages)
    }

    if (key.startsWith('ACK')) {
      switch (type) {
        // 适应旧设备配对确认包，获取设备id指令
        case 'c':
          {
            // ACK:c,<Sum>,<SerialNumber>\r\n\0
            // ACK:c,99,0347313331313931001d0026,0002-001-011,600
            // <SerialNumber> 机器序列和产品属性
            // SerialNumber:“%08x%08x%08x,0001-001-010，%s(DATE)”
            // 前24个字符代表机器ID号
            // 0001-001-010表示产品属性,DATE为版本日期
            let [, serialno, modelno] = option
            this.data.serialno = serialno
            this.data.modelno = modelno.split('-')[0]
            this.data.version = 0
          }
          break
      }
      // 调用总线首发通知
      this.msgCode = msgCodeList[key][type]
      if (this.msgCode) EventBus.post(new EventBus(this.msgCode, this.data))
    }
    if (key.startsWith('ERR')) {
      console.error('捕捉到错误指令', statusPages)
    }
    // ACK和ERR到此结束
    if (this.data.isFullPackage) return

    // 只处理DATA数据
    if (!key.startsWith('DATA')) return

    switch (type) {
      case 's':
        {
          // 长连接状态数据包
          // DATA:s,<count>,<channel>,<NumPhase>,<IntensityCHL>,<IntensityCHR>,<BAT>,<StateRunning>,<StatePhase>,<RemainingTime>,<Wavepercent>,<SettingCHL>, <SettingCHR>,<StateCHL> ,<StateCHR>, <sum>\r\n\0
          // <count> 状态数据包每发送一次自动加1，最小值为0~9；
          // <channel>, 通道编号，1~4； 传入255代表对所有通道进行操作
          // <NumPhase> 当前执行第几阶段，最小值为1；
          // <IntensityCHL> 当前左通道刺激强度，0 ~ 995；
          // <IntensityCHR> 当前右通道刺激强度，0 ~ 995；
          // <BAT> 当前电池状态，0 ~ 100；
          // <StateRunning> 运行状态，可以是: 设置，0 / 运行，1 / 暂停，2 / 停止，3 / 锁定，4
          // <StatePhase> 阶段状态，可以是: 上升，1 / 平台，2 / 下降，3 / 休息，4 / 调整刺激强度，5 / 输出开路，6/ 训练完成，7
          // <RemainingTime> 剩余时间，0~3600
          // <Wavepercent> 波形阶段状态，百分比，30代表百分之三十该阶段状态时间，如当<StatePhase>为1，<Wavepercent>为30，当前运行到上升阶段百分之30的位置。
          // <SettingCHL> 阶段一设置的左插口电量强度
          // <SettingCHR> 阶段一设置的右插口电量强度
          // <StateCHL> 左插口运行状态，1--训练中，2--脱落
          // <StateCHR> 右插口运行状态，1--训练中，2--脱落
          let [count, channel, numPhase, intensityCHL, intensityCHR, bat, stateRunning, statePhase, remainingTime, wavepercent, settingCHL, settingCHR, stateCHL, stateCHR, sum] = option
          this.data = { ...this.data, count, channel, numPhase, intensityCHL, intensityCHR, bat, stateRunning, statePhase, remainingTime, wavepercent, settingCHL, settingCHR, stateCHL, stateCHR, sum }
        }
        break
      case 'r':
        {
          // 获取硬件的最后一个训练程序的状态
          // DATA:r,<RecordId>,<TotalTime>,<Time>,<IsStop>,<sum>\r\n\0
          // 解析：
          // <RecordId> 训练记录id
          // <TotalTime> 设置的训练时长
          // <Time> 已训练的时长
          // <IsStop> 是否已中止，1是，0否

          // 注：
          // 训练正常结束时，<Time>应该和<TotalTime>一致，且<IsStop> 为1
          // 训练过程中，用户手动关闭设备后，再打开设备时，返回的内容：
          // <TotalTime>为设置的时长
          // <Time>为关闭时已训练的时长
          // <IsStop> 为1
          // 硬件收到新的设置程序指令时，才清空缓存，更新为新一次训练的数据
          // 如果没有训练数据：返回ACK:\r\n\0
          let [recordId, totalTime, time, isStop, sum] = option
          this.data = { ...this.data, recordId, totalTime, time, isStop, sum }
        }
        break
      case 'c':
        {
          // DATA:c,<MachineId>,<SerialNumber>,<Data>,<Version>,<Ch1Version>,<Ch2Version>,<Ch3Version>,<Sum>\r\n\0
          // DATA:c,0347313331313931001d0026,0002-001-011,600,1,1,1,0,700
          // <MachineId> 24位机器ID号,不参与Sum的计算
          // <SerialNumber> 产品属性,不参与Sum的计算（xxxx-xxx-xxx）
          // Data为版本日期（MMDD）
          // <Version>代表设备的版本号，优E康是1
          // <Sum>MachineId,SerialNumber不参与Sum的计算
          let [machineId, serialNumber, data, version, ch1Ver, ch2Ver, ch3Ver, sum] = option
          // MachineId,SerialNumber不参与Sum的计算
          option = [data, version, ch1Ver, ch2Ver, ch3Ver, sum]
          this.data.serialno = machineId
          this.data.modelno = serialNumber.split('-')[0]
          this.data.version = version
          this.data.channelVar = [ch1Ver, ch2Ver, ch3Ver].join('.')
          this.data.sum = sum
        }
        break
      case 'b':
        {
          // DATA:b, <channel> ,<step_1> ,<step_2> ,<step_3> ,<step_4> ,<step_5> ,<step_6> ,<step_7> ,<step_8> <Sum>\r\n\0
          // <channel>, 通道编号，1~4；
          // <step_1~8>,阶段1~8相对第一阶段强度差值
          let [channel, step_1, step_2, step_3, step_4, step_5, step_6, step_7, step_8, sum] = option
          this.data.channel = channel
          this.data.step = [step_1, step_2, step_3, step_4, step_5, step_6, step_7, step_8]
          this.data.sum = sum
        }
        break
      case 'k':
        {
          // DATA:k, <channel>, <CMD> ,<SettingCHL>, <SettingCHR>,<StateCHL> ,<StateCHR>,<Sum>\r\n\0
          // <channel>, 通道编号，1~4,255代表对所有通道
          // <CMD>为指令码
          // <SettingCHL>左插口第一阶段强度
          // <SettingCHR> 右插口第一阶段强度
          // <StateCHL> 左插口运行状态，1--训练中，2--脱落
          // <StateCHR> 右插口运行状态，1--训练中，2--脱落
          let [channel, cmd, settingCHL, settingCHR, stateCHL, stateCHR, sum] = option
          this.data = { ...this.data, channel, cmd, settingCHL, settingCHR, stateCHL, stateCHR, sum }
        }
        break
      default:
        return
    }

    // 兼容原代码的过渡用法
    for (let attr in this.data) { this[attr] = this.data[attr] }

    this.data.isFullPackage = (type.charCodeAt() + option.reduce((a, b) => parseInt(a) + parseInt(b))) === parseInt(this.data.sum) * 2
    // option里含有sum，相当于计算了2次，所以要对比sum*2的值

    // 调用总线首发通知
    this.msgCode = msgCodeList[key][type]

    if (this.msgCode) EventBus.post(new EventBus(this.msgCode, this.data))
  }
}

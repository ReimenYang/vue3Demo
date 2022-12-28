/**
 * 杉山ble训练仪指令构造器
// 1
// 定义ble 操作指令
// 所有指令都通过这里的校验、格式化后发出

// 旧版单通道app逻辑
// （待补充整理）
// 新版支持多通道app逻辑
// 连接成功后发送c指令，获取设备信息（机器序列和产品属性）
// 1.开始设置训练
// 2.选择一个训练程序
// 3.设置硬件的参数
//   修改默认训练时长，替代t指令
//   3-0 发送两条d指令
//   3-1 传入程序参数（m）命令
//   3-2 根据训练程序的阶段传入（p）命令,ble使用workoutphaselist,优E康使用phaseList
//   3-3 传入循环（l）命令（如果有）loopcommand1-loopcommand9字段
//   3-4 传入频率数量（w）命令（如果有）frequencycommand字段
//   3-5 传入频率（f）命令（如果有）workoutphaselist/phaseList数组对象字段下的phasefrequency字段
//   3-6 传入频率（b）命令（如果有）设置多阶段与第一阶段强度差值
//   3-7 传入参数结束（e）命令
//   p,l,f指令每个通道单独循环执行
// 4.设置电流
//   传入k命令，
//   通道参数255则所有通道统一此次电流操作
// 6.开始训练
//   6-1 获取训练运行状态
//    传入r命令
//   6-2 检查硬件端是否结束（<IsStop> 为1）
//   如果无记录，执行6-3
//   如果有记录，且状态是结束，上传训练记录成功后，执行6-3
//   如果有记录，且状态不是结束，执行7-2
//   6-3 清空训练记录
//    传入q命令
//   6-4 调用开始训练api
//    返回recordId
//   6-5 设置训练记录数据包
//    传入x命令
//   6-6 开始训练
//    传入 k命令
//   通道参数255则所有通道统一开始操作
// 7.训练结束（app本地计时发现结束）
//   7-1 检查连接状态
//       如果断开，尝试连接
//       无法连接停止后续流程
//       如果连接，继续
//   7-1 获取训练运行状态
//    传入r命令
//   7-2 检查硬件端是否结束（<IsStop> 为1）
//    状态不是结束,计算剩余时间，倒计时结束时重新执行7-1
//    如果状态是结束，继续
//   7-3 结束的话，调用结束训练api
//    上传训练记录成功后，继续
//   7-4 清空训练记录
//    传入q命令
//   7-5 断开蓝牙连接

// 协议文档
// https://shanshanhome.feishu.cn/docs/doccnlPyAP8CVsb8dvIqaBV4IXc#

 */

const headDATA = 'DATA:',
  headACK = 'ACK:',
  headERR = 'ERR:',
  end = ''// '\r\n\0'// 由于ios兼容性问题，结束标志改为writeBLECharacteristicValue写入前加入
/**
 * 构建简单指令
 * 用于相对固定的指令上
 * @return
 */
function commandBuilder () {
  return [...arguments].filter(str => String(str)).join()
}

/**
 * 格式化指令
 * 所有指令都经过这个方法校验
 * 统一输出log
 * @return
 */
function commandFormat () {
  let [Y, N, command, channel, time] = arguments
  // console.log('格式化指令', Y, N, command, channel, time)
  let [type, ...option] = command.replace('DATA:', '').replace('\r\n\0', '').replace('\\r\\n\\0', '').split(',')
  // console.log('分解指令', type, option)
  let hasChannel = ''
  switch (option.length) {
    case Y:
      hasChannel = 'Y'
      // 手动切换channel
      if (channel) option[0] = channel
      break
    case N:
      hasChannel = 'N'
      // 旧指令插入channel
      if (channel) option.unshift(channel)
      break
    default:
      hasChannel = 'ERR'
      break
  }
  // console.log('分解指令', type, option, '是否带有通道信息：', hasChannel)
  if (hasChannel === 'ERR') {
    uni.showToast({
      title: type + '指令出错',
      icon: 'none',
      duration: 2000
    })
    return 'ERR' + command
  }
  option.splice(-1)// 减去sum
  option.unshift(type)
  if (time) {
    option.splice(-1)// 减去time
    option.push(time)
  }
  // console.log('处理指令', option)
  return getCmd(option.join())
}

function getCmd (meddle) {
  let [type, ...option] = meddle.split(',')
  // console.log('getCmd处理指令', meddle, option, type)
  let sum = [0, ...option].reduce((a, b) => Number(a) + Number(b)) - 0 + type.charCodeAt()
  let res = `${headDATA}${meddle},${sum}${end}`
  return res
}

const DeviceCmd = {
  headDATA, headACK, headERR, end,

  /**
   * 获取设备信息
   *
   * 发出 DATA:c,<Sum>\r\n\0
   * 新版接收 DATA:c,<MachineId>,<SerialNumber>,<Data>,<Version>,<Sum>\r\n\0
   * 新版DATA:c,0347313331313931001d0026,0002-001-011,600,1,700
   * 旧版接收 ACK:c,<Sum>,<SerialNumber>\r\n\0
   * 旧版接收 ACK:c,99,0347313331313931001d0026,0002-001-011,600
   * <MachineId> 24位机器ID号,不参与Sum的计算
   * <SerialNumber> 产品属性,不参与Sum的计算（xxxx-xxx-xxx）
   * Data为版本日期（MMDD）
   * <Version>代表设备的版本号，优E康是1
   * <Sum>MachineId,SerialNumber不参与Sum的计算
   * @return
   */
  getCmdDeviceInfo () {
    return getCmd('c')
  },

  /**
   *参数’m’参数命令前发两条’d’
   * 用来保持连接,接收心跳包?
   * @return
   */
  getCmdSubDMa () {
    return getCmd('d,100,200')
  },

  /**
   * 发送程序
   * 发出 DATA:m,<channel>,<PhaseNumber>,<LoopNumber>,<Time>,<Sum>\r\n\0
   * <channel>, 通道编号，1~4,新版支持多通道app特有；
   * <PhaseNumber> 阶段数量，最小值1，最大值为8；
   * <LoopNumber> 循环数量，最小值0，最大值为8；
   * <Time>训练时间，时间单位为秒，最少值为60(s)，最大值为10800(s), 即3小时
   * @return
   */
  setWorkout ({ command, channel, time }) {
    return commandFormat(5, 4, command, channel, time)
  },

  /**
   * 发送阶段
   * 发出 DATA:p,<channel>,<NumPhase>,<Waveform>,<Frequency>,<PulseWidth>,<RampUpTime>,<SteadyTime>,<RampDownTime>,<RestTime>,<Sum>\r\n\0
   * <channel>, 通道编号，1~4,新版支持多通道app特有；
   * <NumPhase> 第几阶段，最小值为1；
   * <Waveform> 波形类型，旧：双相方波脉冲，静脉电流；新：0为双相方波脉冲，1为指数波，待定
   * <Frequency> 脉冲频率，1 ~ 400；
   * <PulseWidth> 脉冲宽度，旧：1 ~ 200；新：1 ~ 500
   * <RampUpTime> 上升时间，0 ~ 10，时间单位为秒；
   * <SteadyTime> 平台时间，0 ~ 30；
   * <RampDownTime> 下降时间，0 ~ 10；
   * <RestTime> 休息时间，0 ~ 30；
   *
   * @return
   */
  setWorkoutPhase ({ command, channel }) {
    return commandFormat(10, 9, command, channel)
  },

  /**
   * 发送循环
   * 发出 DATA:l, <channel>,<NumLoop>,<LoopStartingPhase>,<LoopEndingPhase>,<LoopRepetition>,<Sum>\r\n\0
   * <channel>, 通道编号，1~4,新版支持多通道app特有；
   * <NumLoop> 第几序列，最小为1；
   * <LoopStartingPhase> 起始阶段，最小值为1；
   * <LoopEndingPhase> 结束阶段，最小值为1；
   * <LoopRepetition> 循环次数，最小值是2，最大值为255。
   * @return
   */
  setLoop ({ command, channel }) {
    return commandFormat(6, 5, command, channel)
  },

  /**
   * 发送可变频率阶段数
   * 发出 DATA:w,<channel>, <FreNumber>,<Sum>\r\n\0
   * <channel>, 通道编号，1~4,新版支持多通道app特有；
   * <FreNumber> 可变频率阶段数量
   * @return
   */
  setFre ({ command, channel }) {
    return commandFormat(3, 2, command, channel)
  },

  /**
   * 发送频率变化参数
   * 发出 DATA:f,<channel>,<Numfre >,<NumPhase>,<A_Frequency>,<A_PulseWidth>,<B_Frequency>,<B_PulseWidth>,<C_Frequency>,<C_PulseWidth>,<Sum>\r\n\0
   * <channel>, 通道编号，1~4,新版支持多通道app特有；
   * <Numfre> 第几频率参数设置序列，最小值为1；
   * <NumPhase> 第几阶段，最小值为1；
   * <A_Place> A点位置
   * <A_Frequency> A点频率
   * <A_PulseWidth> A点脉冲宽度
   * <B_Place> B点位置，0~100
   * <B_Frequency> B点频率
   * <B_PulseWidth> B点脉冲宽度
   * <C_Place> C点位置，0~100
   * <C_Frequency> C点频率
   * <C_PulseWidth> C点脉冲宽度
   * （目前现有方案ABC位置为平台0%，%50，%100位置）
   * @return
   */
  setNumfre ({ command, channel }) {
    return commandFormat(10, 9, command, channel)
  },

  // DATA:b, <channel> ,<step_1> ,<step_2> ,<step_3> ,<step_4> ,<step_5> ,<step_6> ,<step_7> ,<step_8> <Sum>\r\n\0
  // <channel>, 通道编号，1~4；
  // <step_1~8>,阶段1~8相对第一阶段强度差值
  setRelativePower ({ command, channel }) {
    return commandFormat(10, 9, command, channel)
  },

  // DATA:a,<channel>,<Sum>,<PlanName>\r\n\0
  // <channel>, 通道编号，1~4；
  // <Sum>校验和 = ‘a’+<channel>,不包含<PlanName>；
  // <PlanName> 方案名称，支持汉字、英文字母和数字，最大允许长度为80个字符 ,20个汉字
  setPlanName (channel, name) {
    return `${headDATA}a,${channel},${'a'.charCodeAt() + Number(channel)},${name}${end}`
  },

  /**
   * 通道参数结束,不可烧写程序设备使用
   * 发出 DATA:e,<channel>,<Sum>\r\n\0
   * 通道参数结束，可烧写设备使用
   * DATA:e,<channel>,<IsSave>,<PlanNo>,<Sum>\r\n\0
   * <channel>, 通道编号，1~4,新版支持多通道app特有；
   * <IsSave>，0：不保存方案，1： 保存方案
/* <PlanNo>，方案序号：1~256
   * @return
   */
  setChannelEnd (channel, isSave, planNo) {
    console.log(isSave === undefined, channel, isSave, planNo, commandBuilder('e', channel, isSave, planNo))
    if (isSave === undefined) return commandFormat(2, 1, getCmd(commandBuilder('e', channel)))
    return commandFormat(4, 3, getCmd(commandBuilder('e', channel, isSave, planNo)))
  },

  /**
   * 左侧电流增加
   *
   * @return
   */
  leftPlus (channel) {
    return commandFormat(3, 2, getCmd(commandBuilder('k', channel, 1)))
  },

  /**
   * 左侧电流减少
   *
   * @return
   */
  leftMinus (channel) {
    return commandFormat(3, 2, getCmd(commandBuilder('k', channel, 2)))
  },

  /**
   * 右侧电流增加
   *
   * @return
   */
  rightPlus (channel) {
    return commandFormat(3, 2, getCmd(commandBuilder('k', channel, 3)))
  },

  /**
   * 右侧电流减少
   *
   * @return
   */
  rightMinus (channel) {
    return commandFormat(3, 2, getCmd(commandBuilder('k', channel, 4)))
  },
  /**
   * 左侧电流强度设置
   *
   * @return
   */
  leftValue (channel, value) {
    return commandFormat(4, 3, getCmd(commandBuilder('k', channel, 12, value)))
  },
  /**
   * 右侧电流强度设置
   *
   * @return
   */
  rightValue (channel, value) {
    return commandFormat(4, 3, getCmd(commandBuilder('k', channel, 13, value)))
  },

  /**
   * 下一阶段
   *
   * @return
   */
  nextPhase (channel) {
    return commandFormat(3, 2, getCmd(commandBuilder('k', channel, 5)))
  },

  /**
   * 获取训练程序状态
   * 发出 DATA:r,<sum>\r\n\0
   * 接收 DATA:r,<RecordId>,<TotalTime>,<Time>,<IsStop>,<sum>\r\n\0
   * <RecordId> 训练记录id
   * <TotalTime> 设置的训练时长
   * <Time> 已训练的时长
   * <IsStop> 是否已中止，1是，0否
   * 注：
   * 1. 训练正常结束时，<Time>应该和<TotalTime>一致，且<IsStop> 为1
   * 2. 训练过程中，用户手动关闭设备后，再打开设备时，返回的内容：
   * <TotalTime>为设置的时长
   * <Time>为关闭时已训练的时长
   * <IsStop> 为1
   * 3. 硬件收到新的设置程序指令时，才清空缓存，更新为新一次训练的数据
   * 4. 如果没有训练数据：返回ACK:\r\n\0
   * @return
   */
  getRecord () {
    return commandFormat(2, 1, getCmd('r'))
  },

  /**
   * 清空训练记录
   * 发出 DATA:q,<sum>\r\n\0
   * @return
   */
  clearRecord () {
    return commandFormat(2, 1, getCmd('q'))
  },

  /**
   * 训练记录
   * 发出 DATA:x,<RecordId>,<sum>\r\n\0
   * @return
   */
  setRecord (recordId) {
    return commandFormat(2, 1, getCmd(commandBuilder('x', recordId)))
  },

  /**
   * 开始训练
   *
   * @return
   */
  startTreatment ({ command, channel }) {
    return commandFormat(3, 2, command || getCmd(commandBuilder('k', channel, 7)))
  },

  /**
   * 暂停
   *
   * @return
   */
  pauseTreatment ({ command, channel }) {
    return commandFormat(3, 2, command || getCmd(commandBuilder('k', channel, 6)))
  },

  /**
   * 结束训练方案
   *
   * @return
   */
  endTreatment ({ command, channel }) {
    return commandFormat(3, 2, command || getCmd(commandBuilder('k', channel, 8)))
  }
}

export default DeviceCmd

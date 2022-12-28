<template>
  <view class="content">
    <!-- #ifndef APP-PLUS  -->
    非app不能使用
    <!-- #endif -->
    <!-- #ifdef APP-PLUS  -->
    <view>
      蓝牙功能:
      <switch
        :checked="bleReady"
        @change="turnOnBluetooth"
        :disabled="bleReady"
      />
    </view>
    <view>
      使用新协议（连接状态下不能改）:
      <switch
        :checked="isNewDevice==='Y'"
        @change="protocolChange"
        :disabled="connected"
      />
    </view>
    <view>
      <button
        @click="bleSearch"
        type="primary"
      >
        搜索设备
      </button>
    </view>
    <view
      v-for="item in BioStimBleModule.deviceList"
      :key="item.name"
    >
      <view @click="selectDevice(item)">
        <text>
          {{ item.name }}
        </text>
        <text v-if="item.isCheck">
          (已选择)
        </text>
      </view>
    </view>
    <button
      @click="connectDevice"
      type="primary"
    >
      确认连接
    </button>
    <view v-if="paired">
      <scroll-view
        class="uni-scroll_box"
        scrollY
      >
        <view class="uni-title">
          训练程序列表:
        </view>
        <view
          class="uni-list-box"
          v-for="item in workoutList"
          :key="item.name"
          @click="selectProject(item)"
        >
          <view class="uni-list_name">
            <text
              class="iconfont icon-check"
              v-if="item.name===workoutProject.name"
            />
            {{ item.name }}
          </view>
          <view class="uni-list_item">
            {{ item.description }}
          </view>
        </view>
      </scroll-view>
      <view>
        训练时间：
        <xnw-number
          :disabled="!workoutProject.initcommand||!workoutProject.initCommand"
          :min="1"
          :value="workTime/60"
          @change="setWorkTime"
        />
        分钟
      </view>
      <button
        @click="sendInit"
        type="primary"
      >
        发送方案
      </button>
      <view v-if="planReady">
        <button
          v-for="item in control"
          :key="item.name"
          :type="item.style"
          @click="item.fun()"
        >
          {{ item.name }}
        </button>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import workoutData from './workoutData.js'
// mixinBLE只为当前demo使用，具体项目需要另外定义
import mixinBLE from './mixinBLE.js'
export default {
  mixins: [mixinBLE],
  data () {
    return {
      workoutList: workoutData.data,
      workoutProject: {},
      bleReady: false, // 是否已打开蓝牙开关
      isAddDeviceSuccess: false, // 是否添加设备成功
      BioStimBleModule: this.libs.global.ble.BioStimBleModule,
      control: [],
      planReady: false,
      workTime: 60
    }
  },
  async created () {
    this.control = [
      { name: '左电流+', fun: this.leftPlus },
      { name: '左电流-', fun: this.leftMinus },
      { name: '右电流+', fun: this.rightPlus },
      { name: '右电流-', fun: this.rightMinus },
      { name: '开始训练', fun: this.startTreatment, style: 'primary' },
      { name: '暂停训练', fun: this.pauseTreatment },
      { name: '退出训练', fun: this.endTreatment },
      { name: '断开蓝牙设备', fun: this.closeBLEConnection }
    ]
  },
  onBackPress () {
    if (!this.isAddDeviceSuccess) this.closeBLEConnection()
    return true
  },
  methods: {
    turnOnBluetooth () {
      if (this.bleReady) return
      // 因为调用BioStimBleModule.turnOnBluetoothSwitch出现问题
      // 临时使用bleStateChange监听方式处理
      this.turnOnBluetoothSwitch()
    },
    protocolChange (e) {
      this.isNewDevice = this.globalData.isNewDevice = e.detail.value ? 'Y' : 'N'
    },
    selectProject (item) {// 选择计划
      this.globalData.workout = item
      console.log('workoutDetail程序明细', this.globalData.workout)
      this.workTime = item.duration
    },
    sendInit () {
      this.planReady = true
      return this.sendInitCmd()
    },
  }
}
</script>

<style lang="scss" scoped>
.content {
  line-height: 3em;
}
.uni-scroll_box {
  height: 70%;
  background: #fff;
  border-radius: 20rpx;
}

.uni-list-box {
  margin: 0 20rpx;
  padding: 15rpx 0;
  border-bottom: 1px #f5f5f5 solid;
  box-sizing: border-box;
}

.uni-list:last-child {
  border: none;
}

.uni-list_name {
  font-size: 30rpx;
  color: #333;
}

.uni-list_item {
  font-size: 24rpx;
  color: #555;
  line-height: 1.5;
}
</style>

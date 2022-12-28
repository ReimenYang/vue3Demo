<template>
  <view
    :class="dialogClass"
    v-if="config.visible"
    :style="setStyle"
  >
    <view
      class="mask"
      :style="'z-index:' + getMaxIndex + ';' + maskStyle + (!showMask?'background:transparent;':'')"
      @click="dialogClose(touchMaskClose)"
    >
      <view
        class="dialogBody"
        @click.stop
        :style="bodyStyle"
      >
        <view
          class="header"
          v-if="title"
          :style="titleStyle"
        >
          <slot name="header">
            <view class="txt">
              {{ title }}
            </view>
            <view
              class="btn"
              v-if="showHeadCloseBtn"
              @click="dialogClose(true)"
            >
              X
            </view>
          </slot>
        </view>
        <view
          class="content"
          :style="{width,height,'overflow-y': 'auto'}"
        >
          <slot />
        </view>
        <view class="footer">
          <slot name="footer">
            <view class="btnGroup">
              <view
                class="btn"
                v-if="showClose"
                :style="closeBtnStyle"
                @click="dialogClose(true)"
              >
                {{ textClose }}
              </view>
              <view
                class="btn primary"
                v-if="showConfirm"
                :style="confirmBtnStyle"
                @click="dialogSubmit"
              >
                {{ textConfirm }}
              </view>
            </view>
          </slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'XnwDialog',
  props: {
    config: {
      type: Object,
      default () { return { visible: false } }
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    setStyle: {
      type: String,
      default: ''
    },
    maskStyle: {
      type: String,
      default: ''
    },
    bodyStyle: {
      type: String,
      default: ''
    },
    showMask: {
      type: Boolean,
      default: true
    },
    showHeadCloseBtn: {
      type: Boolean,
      default: false
    },
    setClass: {
      type: Array,
      default: () => []
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    titleStyle: {
      type: String,
      default: ''
    },
    textClose: {
      type: String,
      default: '取消'
    },
    closeBtnStyle: {
      type: String,
      default: ''
    },
    textConfirm: {
      type: String,
      default: '确定'
    },
    confirmBtnStyle: {
      type: String,
      default: ''
    },
    onConfirm: {
      type: Function,
      default: () => { return }
    },
    onClose: {
      type: Function,
      default: () => { return }
    },
    touchMaskClose: {
      type: Boolean,
      default: true
    },
  },
  computed: {
    getMaxIndex: function () {
      let result = 900
      // #ifdef H5
      let allIndex = []
      let allElement = document.all || document.querySelectorAll('*')
      for (let i = 0; i < allElement.length; i++) {
        const zIndex = window.getComputedStyle(allElement[i], null).zIndex
        if (!isNaN(zIndex)) allIndex.push(Number(zIndex))
      }
      result = Math.max(...allIndex) + 1
      if (result > 900) result = 900
      // #endif
      return result
    },
    dialogClass: function () {
      return ['dialogBox', ...this.setClass]
    }
  },
  methods: {
    dialogClose (touchMaskClose = true) {
      if (!touchMaskClose) return
      if (this.onClose) this.onClose()
      this.$emit('onClose', false)
    },
    async dialogSubmit () {
      let _v = true
      if (this.onConfirm) _v = await this.onConfirm()// 此方法直接返回布尔值判断是否拦截，小程序不适用
      if (!_v) return
      this.dialogClose()
      this.$emit('onConfirm', _v)// 此方法需要父级二次设置状态，所有平台适用
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./dialog.scss";
.header {
  position: relative;
}
.header .btn {
  position: absolute;
  top: 50%;
  right: 30rpx;
  font-size: 30rpx;
  transform: translateY(-50%);
}
</style>

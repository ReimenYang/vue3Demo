<template>
  <view :class="{footer:true,fixedBottom:isFix}">
    <slot>
      <view class="btnGroup">
        <view
          class="btn"
          v-if="showCancel"
          @click="handleCancel"
        >
          {{ textCancel }}
        </view>
        <view
          class="btn primary"
          v-if="showConfirm"
          @click="handleSubmit"
        >
          {{ textConfirm }}
        </view>
      </view>
    </slot>
  </view>
</template>

<script>
export default {
  name: 'XnwFooter',
  props: {
    showCancel: {
      type: Boolean,
      default: true
    },
    showConfirm: {
      type: Boolean,
      default: true
    },
    textCancel: {
      type: String,
      default: '取消'
    },
    textConfirm: {
      type: String,
      default: '确定'
    },
    onConfirm: {
      type: Function,
      default: () => true
    },
    onCancel: {
      type: Function,
      default: () => true
    },
    isFix: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCancel () {
      if (this.onCancel) this.onCancel()
      this.$emit('onCancel', false)
    },
    async handleSubmit () {
      let _v = true
      if (this.onConfirm) _v = await this.onConfirm()// 此方法直接返回布尔值判断是否拦截，小程序不适用
      if (!_v) return
      this.onCancel()
      this.$emit('onConfirm', _v)// 此方法需要父级二次设置状态，所有平台适用
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  height: var(--button-height);
  line-height: var(--button-height);
}
.fixedBottom {
  position: fixed;
  left: 0;
  bottom: 0;
}
</style>

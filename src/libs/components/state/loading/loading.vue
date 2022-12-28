<template>
  <view
    class="loading"
    :style="setStyle"
  >
    <image
      src="../images/loadingA.gif"
      mode="aspectFit"
      class="img"
      v-if="showImg==='Y'"
    />
    <view class="text">
      {{ text }}
    </view>
  </view>
</template>

<script>
export default {
  name: 'XnwLoading',
  props: {
    setStyle: {
      type: String || Object,
      default: () => { return '' }
    },
    text: {
      type: String,
      default: () => { return '加载中' },
    },
    showImg: {
      type: String,
      default: () => { return 'Y' },
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  width: 10em;
  font-size: 32rpx;
  text-align: center;
  color: var(--color-light);
  .img {
    width: 10em;
    height: 7.5em;
  }
}
</style>

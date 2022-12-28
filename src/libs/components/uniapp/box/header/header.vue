<template>
  <view
    class="header"
    :style="headerStyle"
  >
    <view
      class="back"
      @click="onBack"
    >
      <slot name="back">
        <text
          v-if="backIcon"
          class="backIcon iconfont icon-left"
          :class="backIcon"
        />
        <text
          v-if="backTxt"
          class="backTxt"
        >
          {{ backTxt }}
        </text>
      </slot>
    </view>
    <view
      class="title"
      :style="titleStyle"
    >
      <slot name="title">
        <text
          v-if="icon"
          class="titleIcon"
          :class="icon"
          :style="iconStyle"
        />
        <text class="titleTxt">
          {{ title }}
        </text>
      </slot>
    </view>
    <view
      v-if="showMore"
      class="more"
      :style="moreStyle"
      @click.stop="handleMoreClick"
    >
      <slot name="more">
        <text class="moreTxt">
          {{ moreTxt }}
        </text>
        <text
          v-if="moreIcon"
          class="moreIcon"
          :class="moreIcon"
        />
      </slot>
    </view>
  </view>
</template>
<script>
export default {
  name: 'XnwHeader',
  props: {
    backTxt: {
      type: String,
      default: ''
    },
    backIcon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    titleStyle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconStyle: {
      type: String,
      default: ''
    },
    headerStyle: {
      type: String,
      default: ''
    },
    showMore: {
      type: Boolean,
      default: false
    },
    moreTxt: {
      type: String,
      default: '更多'
    },
    moreIcon: {
      type: String,
      default: ''
    },
    moreStyle: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleMoreClick () {
      this.$emit('onMoreClick', true)
    },
    onBack () {
      this.$emit('onBack')
    },
  }
}
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  width: 100%;
  min-height: 80rpx;
  .title {
    overflow: hidden;
    flex: 1;
    font-size: var(--font-h3);
    color: var(--color-normal);
  }
  .more {
    position: relative;
    margin-left: 20rpx;
    font-size: var(--font-h5);
    color: var(--color-tips);
  }
}
</style>

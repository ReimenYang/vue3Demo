<template>
  <view class="grid">
    <view
      class="item"
      v-for="(item, index) of list"
      :key="index"
      :style="item.style"
      @click="handleClick(item)"
    >
      <view
        class="navIcon"
        :class="item.icon"
        :style="item.iconStyle"
      >
        <view
          class="badge"
          v-if="item.badge"
        >
          {{ item.badge + item.badgeUnit }}
        </view>
      </view>
      <view class="txt">
        {{ item.txt }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'XnwGrid',
  props: {
    list: {
      type: Array,
      default () {
        return [
          {
            txt: '我的卡牌',
            style: '',
            icon: 'iconfont-heroGame icon-poker',
            iconStyle: 'background-color:#3D7DEF',
            badge: '12次',
            url: '/pages/pokerGame/pokerGame'
          },
        ]
      }
    }
  },
  methods: {
    handleClick (item) {
      this.$emit('onClick', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.grid {
  display: flex;
  align-items: center;
  align-content: center;
  flex-flow: row wrap;
  justify-content: flex-start;
  padding: 30rpx;
  background-color: var(--color-white);

  .item {
    flex: 1;
    margin-top: 10rpx;
    min-width: 33%;

    .navIcon {
      position: relative;
      margin: auto;
      border-radius: 50%;
      width: 100rpx;
      height: 100rpx;
      font-size: 56rpx;
      line-height: 100rpx;
      text-align: center;
      color: var(--color-white);
    }
    .navIcon .badge {
      position: absolute;
      top: 4rpx;
      left: 70rpx;
      border-radius: 18rpx;
      padding: 0 10rpx;
      width: auto;
      height: 36rpx;
      font-size: var(--font-h6);
      line-height: 36rpx;
      white-space: nowrap;
      color: var(--color-white);
      background-color: #d43b49;
    }
    .txt {
      margin-top: 12rpx;
      font-size: var(--font-h5);
      text-align: center;
    }
  }
}
</style>

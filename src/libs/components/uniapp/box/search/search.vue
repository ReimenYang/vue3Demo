<template>
  <view
    class="search"
    :style="searchStyle"
  >
    <view
      class="inputBox"
      :style="inputBoxStyle"
    >
      <slot name="input">
        <text
          class="searchIcon"
          v-if="showIcon"
          :class="iconClass"
          :style="iconStyle"
        />
        <input
          type="text"
          :maxlength="-1"
          confirm-type="search"
          :class="{'hasIcon':showIcon}"
          :style="inputStyle"
          :placeholder="placeholderTxt"
          :placeholder-style="placeholderStyle"
          :value="searchWord"
          @input="handleInput"
          @confirm="handleSearch"
        >
        <text
          :class="'close ' + closeIcon"
          :style="closeIconStyle"
          v-if="searchWord"
          @click="clear"
        />
      </slot>
    </view>
    <view
      class="submitBtn"
      v-if="showSearchBtn"
      :style="searchBtnStyle"
      @click="handleSearch"
    >
      <slot name="search">
        <text>{{ searchTxt }}</text>
      </slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'XnwSearch',
  props: {
    searchStyle: {
      type: String,
      default: ''
    },
    inputBoxStyle: {
      type: String,
      default: ''
    },
    placeholderTxt: {
      type: String,
      default: ''
    },
    placeholderStyle: {
      type: String,
      default: ''
    },
    inputStyle: {
      type: String || Object,
      default: ''
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    iconClass: {
      type: String,
      default: 'iconfont icon-search'
    },
    iconStyle: {
      type: String,
      default: ''
    },
    closeIcon: {
      type: String,
      default: 'iconfont icon-close-circle'
    },
    closeIconStyle: {
      type: String,
      default: ''
    },
    showSearchBtn: {
      type: Boolean,
      default: false
    },
    searchTxt: {
      type: String,
      default: '搜索'
    },
    searchBtnStyle: {
      type: String || Object,
      default: ''
    },
    keyWord: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchWord: this.keyWord,
    }
  },
  methods: {
    handleInput (e) {
      this.searchWord = e.detail.value
      this.$emit('change', this.searchWord)
    },
    handleSearch () {
      this.$emit('confirm', this.searchWord)
    },
    clear () {
      this.searchWord = ''
      this.$emit('change', this.searchWord)
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.search {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 64rpx;

  .inputBox {
    position: relative;
    flex: 1;
    border-radius: var(--border-radius);

    input {
      display: block;
      padding: 8rpx 50rpx 8rpx 16rpx;
      min-height: 64rpx;
      font-size: var(--font-h4);
      color: var(--color-normal);
      background-color: var(--color-background);

      &.hasIcon {
        padding-left: 50rpx;
      }
    }
    .searchIcon {
      position: absolute;
      top: 50%;
      left: 8rpx;
      font-size: var(--font-h4);
      color: var(--color-tips);
      transform: translateY(-50%);
    }
    .close {
      position: absolute;
      top: 50%;
      right: 8rpx;
      font-size: var(--font-h4);
      color: var(--color-tips);
      transform: translateY(-50%);
    }
  }
  .submitBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10rpx;
    border-radius: var(--border-radius);
    padding: 0 12rpx;
    min-width: 100rpx;
    min-height: 64rpx;
    font-size: var(--font-h5);
    color: var(--color-white);
    background-color: var(--theme-color);
  }
}
</style>

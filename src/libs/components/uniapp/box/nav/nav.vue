<template>
  <scroll-view
    :scrollX="true"
    :scrollLeft="scrollLeft"
    scrollWithAnimation
    class="nav"
    :style="navStyle"
    @scroll="scroll"
  >
    <view
      class="list"
      :style="listStyle"
    >
      <view
        class="item"
        :style="index===curTab?activeStyle:tabStyle"
        v-for="(item,index) in list"
        :key="index"
        @click="tabClick($event,item,index)"
      >
        <text
          v-if="item.icon"
          :class="'iconfont icon-'+item.icon"
          :style="item.iconStyle"
        />{{ item.txt }}
        <view
          v-if="customStyle"
          class="itemActive"
          :style="index===curTab?customStyle:''"
        />
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: 'XnwNav',
  props: {
    list: {
      type: Array,
      default: () => {
        return [
          // {
          // 	txt: '标签标签一',
          // 	value: '0',
          // 	icon: '',
          // 	iconStyle: ''
          // },
        ]
      }
    },
    navStyle: {
      type: String,
      default: ''
    },
    listStyle: {
      type: String,
      default: ''
    },
    tabStyle: {
      type: String,
      default: ''
    },
    activeStyle: {
      type: String,
      default: ''
    },
    customStyle: {
      type: String,
      default: ''
    },
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    defaultIndex (val) {
      this.curTab = Number(this.defaultIndex)
      if (val === 0) this.scrollLeft = 0
    }
  },
  data () {
    return {
      scrollLeft: 0,
      curTab: Number(this.defaultIndex),
      oldScroll: 0,
      oldScrollIndex: 0,
    }
  },
  methods: {
    scroll (e) {
      console.log(e)
    },
    tabClick (e, item, index) {
      this.oldScroll = this.scrollLeft
      if (this.oldScrollIndex > index) this.scrollLeft = Number(e.currentTarget.offsetLeft) - 60
      else this.scrollLeft = Number(e.currentTarget.offsetLeft)
      this.oldScrollIndex = index
      this.curTab = index
      let Obj = item
      this.$emit('onClick', Obj)
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
.nav {
  width: 100%;
  white-space: nowrap;

  .list {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  .item {
    position: relative;
    padding: 0 12rpx;
    font-size: var(--font-h4);
    text-align: center;
    color: var(--color-normal);

    .itemActive {
      position: absolute;
      bottom: 0;
      content: "";
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>

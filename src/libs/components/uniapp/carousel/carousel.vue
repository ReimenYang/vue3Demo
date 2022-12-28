<template>
  <view
    :class="carouselClass"
    :style="{width: width,height:height}"
  >
    <view
      class="clickBar iconfont icon-left"
      @click="goto('prev')"
      v-if="showClickBar"
    />
    <view
      class="clickBar iconfont icon-right"
      @click="goto('next')"
      v-if="showClickBar"
    />
    <view
      class="imgBox"
      :style="'margin-left:'+ setMarginLeft + 'px'"
      @touchmove="handletouchmove"
      @touchstart="handletouchstart"
      @touchend="handletouchend"
    >
      <view
        class="img"
        v-for="item in dataList"
        :key="item.id"
        :style="'flex: 0 0 '+ getItemWidth +'px'"
      >
        <image
          :src="item[url]"
          mode="widthFix"
          :style="imgStyle"
        />
      </view>
    </view>
    <view class="navbar">
      <view
        :class="{dot:true,hover:hoverIndex===i}"
        v-for="(item,i) in dataList"
        :key="'dot'+i"
        @click="goto(i)"
      />
    </view>
  </view>
</template>

<script>
import './carousel.scss'
export default {
  props: {
    dataList: {
      type: Array,
      default () {
        return []
      }
    },
    url: {
      type: String,
      default: 'url'
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    setClass: {
      type: Array,
      default: () => []
    },
    onClick: {
      type: Function,
      default: () => { return }
    },
    showClickBar: {
      type: Boolean,
      default: false
    },
    imgStyle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      hoverIndex: 0,
      setMarginLeft: 0,
      flag: 0, // 1向左滑动,2向右滑动,3向上滑动 4向下滑动
      text: '', // 向哪里滑动
      lastX: 0,
      lastY: 0,
      index: 0
    }
  },
  computed: {
    getItemWidth () {
      if (this.width.indexOf('%')) return parseInt(this.width) / 100 * this.WindowWidth
      if (this.width.indexOf('rpx')) return parseInt(this.width) / 750 * this.WindowWidth
      if (this.width.indexOf('px')) return parseInt(this.width)
      return this.WindowWidth
    },
    carouselClass: function () {
      return ['carouselBox', ...this.setClass]
    }
  },
  methods: {
    goto (data) {
      // console.log(data);
      switch (data) {
        case 'prev':
          if (this.hoverIndex > 0) {
            this.hoverIndex--
            this.setMarginLeft += this.getItemWidth
          }
          break
        case 'next':
          if (this.hoverIndex < this.dataList.length - 1) {
            this.hoverIndex++
            this.setMarginLeft -= this.getItemWidth
          }
          break
        default:
          this.hoverIndex = data
          this.setMarginLeft = -this.getItemWidth * data
      }
    },
    dialogClose () {
      if (this.onClose) this.onClose()
      this.config.visible = false
    },
    dialogSubmit () {
      if (this.onConfirm) this.onConfirm()
      this.dialogClose()
    },
    handletouchmove (event) {
      // console.log(event);
      if (this.flag !== 0) return
      let currentX = event.changedTouches[0].pageX
      let currentY = event.changedTouches[0].pageY
      let tx = currentX - this.lastX
      let ty = currentY - this.lastY
      let text = ''
      this.mindex = -1
      // 左右方向滑动
      if (Math.abs(tx) > Math.abs(ty)) {
        if (tx < 0) {
          text = '向左滑动'
          this.flag = 1
          //  this.getList();  //调用列表的方法
        } else if (tx > 0) {
          text = '向右滑动'
          this.flag = 2
        }
      }
      // 上下方向滑动
      else {
        if (ty < 0) {
          text = '向上滑动'
          this.flag = 3
          //  this.getList();  //调用列表的方法
        } else if (ty > 0) {
          text = '向下滑动'
          this.flag = 4
        }
      }
      // 将当前坐标进行保存以进行下一次计算
      this.lastX = currentX
      this.lastY = currentY
      this.text = text
    },
    handletouchstart (event) {
      // console.log(event);
      this.lastX = event.changedTouches[0].pageX
      this.lastY = event.changedTouches[0].pageY
    },
    handletouchend (event) {
      // console.log(event);
      event.changedTouches[0].pageX
      this.flag = 0
      this.text = '没有滑动'
      if (this.lastX - event.changedTouches[0].pageX > 50) return this.goto('next')
      if (event.changedTouches[0].pageX - this.lastX > 50) return this.goto('prev')
    }
  }
}
</script>

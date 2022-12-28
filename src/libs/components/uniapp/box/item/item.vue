<template>
  <view
    class="itemBox"
    :class="[{'flex-row':info.postPosition==='left'},{'flex-row-reverse':info.postPosition==='right'}]"
    :style="info.itemStyle"
    @click="handleClick"
  >
    <view
      v-if="info.post"
      class="post"
      :style="info.postStyle"
    >
      <slot name="post">
        <image
          :src="info.post"
          mode="aspectFill"
        />
      </slot>
    </view>
    <view
      class="info"
      :style="info.infoStyle"
    >
      <slot name="info">
        <view
          class="title"
          :style="info.titleStyle"
        >
          {{ info.title }}
        </view>
        <view
          class="tagBox"
          v-if="info.tags&&info.tags.length>0"
        >
          <view
            class="txt"
            v-for="(item,index) of info.tags"
            :key="index"
            :style="item.style"
          >
            <text
              v-if="item.icon"
              :class="item.icon"
              :style="item.iconStyle"
            />{{ item.txt }}
          </view>
        </view>
        <block v-if="info.contents&&info.contents.length>0">
          <view
            class="contents"
            v-for="(item,index) of info.contents"
            :key="index"
            :style="item.style"
          >
            <text
              v-if="item.icon"
              :class="item.icon"
              :style="item.iconStyle"
            />{{ item.txt }}
          </view>
        </block>
      </slot>
    </view>
    <view class="infoFooter">
      <slot name="footer" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'XnwItem',
  props: {
    info: {
      type: Object,
      default () {
        return {
          itemStyle: '',
          post: '',
          postPosition: 'left',
          postStyle: '',
          infoStyle: '',
          title: '',
          titleStyle: '',
          tags: [
            // {
            // 	txt: '',
            // 	style: '',
            // 	icon: '',
            // 	iconStyle: ''
            // }
          ],
          contents: [
            // {
            // 	txt: '',
            // 	style: '',
            // 	icon: '',
            // 	iconStyle: ''
            // }
          ]
        }
      }
    },
  },
  methods: {
    handleClick () {
      this.$emit('click', true)
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
.flex-row {
  flex-direction: row;
}
.flex-row-reverse {
  flex-direction: row-reverse;
}
.itemBox {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;

  .post {
    padding: 30rpx 0;
    width: 300rpx;
    height: 200rpx;
  }
  .info {
    flex: 1;
    padding: 30rpx;

    .title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      width: 100%;
      min-height: 90rpx;
      font-size: var(--font-h4);
      color: var(--color-normal);
    }
    .tagBox {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      margin-top: 20rpx;

      .txt {
        display: inline-flex;
        align-items: center;
        margin-right: 20rpx;
        font-size: var(--font-h6);
      }
    }
    .date {
      margin-top: 10rpx;
      font-size: var(--font-h6);
      color: var(--color-tips);
    }
  }
  .infoFooter {
    width: 100%;
  }
}
</style>

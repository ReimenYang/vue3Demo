<template>
  <view class="uploadBox">
    <block v-if="mode==='single'">
      <view
        class="bg-img"
        :style="uploadBox.style"
        v-if="imgObject.url"
      >
        <image
          :src="imgObject.url"
          mode="aspectFill"
          lazyLoad="true"
        />
        <view
          class="cu-tag bg-red"
          @click.stop="del"
        >
          <view class="iconfont icon-close" />
        </view>
      </view>
      <view
        class="noImg"
        :style="uploadBox.style"
        @click="choose"
        v-if="!imgObject.url"
      >
        <view
          :class="uploadBox.icon"
          :style="uploadBox.iconStyle"
        />
      </view>
    </block>
    <block v-if="mode==='multiple'">
      <view v-if="imgList.length>0">
        <view
          class="bg-img"
          :style="uploadBox.style"
          v-for="(item, index) in imgList"
          :key="index"
        >
          <image
            :src="item.url"
            mode="aspectFill"
            lazyLoad="true"
          />
          <view
            class="cu-tag bg-red"
            @click.stop="del(item)"
          >
            <view class="iconfont icon-close" />
          </view>
        </view>
      </view>
      <view
        class="noImg"
        :style="uploadBox.style"
        @click="choose"
        v-if="imgList.length<maxNum"
      >
        <view
          :class="uploadBox.icon"
          :style="uploadBox.iconStyle"
        />
      </view>
    </block>
  </view>
</template>

<script>

export default {
  props: {
    mode: {
      type: String,
      default: 'single'
    },
    maxNum: {
      type: Number,
      default: 1
    },
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    },
    imgObj: {
      type: Object,
      default () {
        return {
          bucketName: '',
          fileName: '',
          url: ''
        }
      }
    },
    uploadBox: {
      type: Object,
      default: () => {
        return {
          style: '',
          icon: 'iconfont icon-plus',
          iconStyle: ''
        }
      }
    },
  },
  data () {
    return {
      imgObject: this.imgObj,
      imgFinalList: this.imgList
    }
  },
  created () {
    console.log(this.imgFinalList)
  },
  computed: {},
  methods: {
    choose () {
      uni.chooseImage({
        count: 1, // 可选个数
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          let tempFilePaths = res.tempFiles[0].path
          await this.upload(tempFilePaths)
        }
      })
    },
    async upload (filePath) {
      let { configProject, api } = this.libs
      let { urlApi, apiGroup } = configProject
      return new Promise((resolve, reject) => {
        uni.showLoading({
          title: '上传中'
        })
        uni.uploadFile({
          filePath,
          name: 'file',
          url: `${urlApi}${apiGroup.admin}${api.admin.sysFile.public.url}`,
          header: this.globalData.headers,
          success: res => {
            uni.hideLoading()
            res.data = JSON.parse(res.data)
            if (res.data.code === 0) {
              this.toast('上传成功', 2000, 'success')
              if (this.mode === 'single') {
                this.imgObject = { ...this.imgObj, ...res.data.data }
                this.$emit('onSuccess', this.imgObject)
              }
              if (this.mode === 'multiple') {
                this.imgFinalList.push(res.data.data)
                this.$emit('onSuccess', this.imgFinalList)
              }
              resolve(res.data.data)
            } else {
              this.toast(res.data.msg, 2000)
              this.$emit('uploadimagefail')
              reject(res.data.msg)
            }
          },
          fail: err => {
            uni.hideLoading()
            console.log(err)
            this.toast('上传失败', 2000)
            this.$emit('uploadimagefail')
            reject('上传失败')
          },
        })
      })
    },
    del (obj) {
      if (this.mode === 'single') {
        this.imgObject = { ...this.imgObj, bucketName: '', fileName: '', url: '' }
        this.$emit('onDel', this.imgObject)
      }
      if (this.mode === 'multiple') {
        let delIndex = this.imgFinalList.findIndex(item => item.url === obj.url)
        this.imgFinalList.splice(delIndex, 1)
        this.$emit('onDel', this.imgFinalList)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadBox {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.bg-img {
  margin-right: 20rpx;
  width: 200rpx;
  height: 200rpx;
  position: relative;
}

.noImg {
  width: 2.5em;
  background-color: var(--color-background);
  text-align: center;
  font-size: 36px;
  line-height: 2.5em;
  color: var(--color-tips);
  border: 2rpx dashed var(--color-tips);
}
.noImg .icon-plus {
  display: block;
  font-size: 42px;
  margin: 0px auto;
  color: var(--color-tips);
  transition: font-size 0.25s linear, width 0.25s linear;
}
.bg-img .icon-close {
  display: block;
  font-size: var(--font-h2);
  color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--mask-deep);
}
</style>

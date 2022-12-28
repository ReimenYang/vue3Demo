<template>
  <view class="wrap">
    <view
      class="addressSelsct"
      v-if="type==='list'"
    >
      <uni-list>
        <uni-list-item
          v-for="item in addressList"
          :title="`${item.name} ${item.phoneNumber}`"
          :note="`${item.province} ${item.city} ${item.detailAddress}`"
          :key="item.id"
          clickable
          @click="onSelsct(item)"
        />
      </uni-list>
      <xnw-footer
        :isFix="true"
        textConfirm="添加地址"
        @onCancel="onSelsctCancel"
        @onConfirm="onNewAddress"
      />
    </view>
    <view
      class="addAddress"
      v-if="type==='add'"
    >
      <uni-forms
        :value="newAddress"
        ref="form"
        class="addAddressForm"
        :rules="rules"
      >
        <uni-forms-item
          required
          label="收货人"
          name="name"
        >
          <uni-easyinput
            type="text"
            v-model="newAddress.name"
            placeholder="请填写真实姓名(快递需要)"
          />
        </uni-forms-item>
        <uni-forms-item
          required
          name="phoneNumber"
          label="联系电话"
        >
          <uni-easyinput
            type="number"
            v-model="newAddress.phoneNumber"
            placeholder="请输入手机号码"
          />
        </uni-forms-item>
        <uni-forms-item
          required
          label="选择地区"
          name="address"
        >
          <uni-data-picker
            :class="{errorMessage:cityError}"
            placeholder="请选择地址"
            popupTitle="请选择城市"
            collection="opendb-city-china"
            field="code as value, name as text"
            orderby="value asc"
            :stepSearh="true"
            selfField="code"
            parentField="parent_code"
            @change="setCity"
          />
          <view
            class="errorMessage"
            v-if="cityError"
          >
            请选择地区
          </view>
        </uni-forms-item>
        <uni-forms-item
          required
          label="详细地址"
          name="detailAddress"
        >
          <uni-easyinput
            type="textarea"
            v-model="newAddress.detailAddress"
            placeholder="请输入详细地址"
          />
        </uni-forms-item>
        <uni-forms-item
          label="设为默认"
          name="defaultStatus"
        >
          <switch
            :checked="newAddress.defaultStatus===1"
            @change="setDefaultAddress"
          />
        </uni-forms-item>
      </uni-forms>
      <xnw-footer
        :isFix="true"
        :textConfirm="textAddConfirm"
        @onCancel="onAddCancel"
        @onConfirm="onAddConfirm"
      />
    </view>
  </view>
</template>

<script>
export default {
  name: 'XnwAddress',
  props: {
    addressList: {
      type: Array,
      default () { return [] }
    },
    type: {
      type: String,
      default: 'list'
    },
    textAddConfirm: {
      type: String,
      default: '提交地址'
    }
  },
  data () {
    return {
      newAddress: {
        memberId: '1',
        name: '',
        phoneNumber: '',
        province: '',
        city: '',
        region: '',
        detailAddress: '',
        defaultStatus: 0
      },
      rules: {
        name: {
          rules: [{
            required: true,
            errorMessage: '请输入收货人姓名',
          },
          {
            minLength: 2,
            maxLength: 5,
            errorMessage: '收货人姓名长度在 {minLength} 到 {maxLength} 个字符',
          }
          ]
        },
        phoneNumber: {
          rules: [{
            required: true,
            errorMessage: '请输入手机号码',
          }, {
            pattern: this.libs.data.verify.rule.phone,
            errorMessage: '请正确输入手机号码',
          }]
        },
        detailAddress: {
          rules: [{
            required: true,
            errorMessage: '请输入详细地址',
          }]
        }
      },
      cityError: false
    }
  },
  onShow () {
    this.newAddress = {
      memberId: '1',
      name: '',
      phoneNumber: '',
      province: '',
      city: '',
      region: '',
      detailAddress: '',
      defaultStatus: 0
    }
  },
  methods: {
    setDefaultAddress () {
      this.newAddress.defaultStatus = this.newAddress.defaultStatus ? 0 : 1
    },
    setCity (e) {
      let _address = e.detail.value
      this.newAddress.province = _address[0].text
      this.newAddress.city = _address[1].text
      this.newAddress.region = _address[2].text
      this.cityError = false
    },
    onAddCancel () {
      this.$emit('onAddCancel', {})
    },
    onAddConfirm () {
      this.$refs.form.submit()
      let { province, city, region } = this.newAddress
      if (!province || !city || !region) {
        this.cityError = true
        return
      }
      this.$emit('onAddConfirm', this.newAddress)
    },
    onSelsct (item) {
      this.$emit('onSelsct', item)
    },
    onListBack () {
      this.$emit('onListBack', {})
    },
    onNewAddress () {
      this.$emit('onNewAddress', this.newAddress)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  .addressSelsct {
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .addAddress {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #fff;
    .addAddressForm {
      padding: 40rpx 40rpx 0;
      .errorMessage {
        line-height: 44rpx;
        color: #dd524d;
        :deep(.input-value-border) {
          border-color: #dd524d;
        }
      }
    }
  }
}
</style>

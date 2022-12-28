<template>
  <el-autocomplete
    v-model="dataValue"
    :fetchSuggestions="querySearch"
    placeholder="请输入"
    @select="handleSelect"
    :disabled="disabled"
    clearable
  />
</template>

<script>
export default {
  name: 'InputAutocomplete',
  props: {
    disabled: {
      type: Boolean
    },
    dataArray: {
      type: Array,
      default: []
    },
    label: {
      type: String,
      default: 'value'
    },
    dataObject: {
      type: Object,
      default: {}
    },
    paramsKey: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataValue: '',
      dataList: []
    }
  },
  watch: {
    dataValue: {
      handler: function () {
        if (this.paramsKey) this.dataObject[this.paramsKey] = this.dataValue
      },
      deep: true
    },
    dataArray: {
      handler: function () {
        this.init()
      },
      deep: true
    },
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.paramsKey) this.dataValue = this.dataObject[this.paramsKey]
      this.dataList = this.dataArray
      this.dataList.forEach(item => {
        item.value = item[this.label]
      })
    },
    querySearch (queryString, callback) {
      if (!this.dataArray.length) return callback([{ value: '' }])
      let results = queryString
        ? this.dataArray.filter(item => item[this.label].toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
          .sort((a, b) => a[this.label].indexOf(queryString) - b[this.label].indexOf(queryString))
        : this.dataArray
      // 调用 callback 返回建议列表的数据
      callback(results)
    },
    handleSelect (item) {
      console.log(item)
    },
  }
}
</script>

<template>
  <view
    class="pickerWrap"
    v-if="multiArray.length"
  >
    <picker
      mode="multiSelector"
      @columnchange="onColumnchange"
      @change="onChange"
      @cancel="onCancel"
      :value="multiIndex"
      :range="multiArray"
      class="picker"
    >
      <view
        class="uni-input"
        @click="icon='icon-up'"
      >
        {{ cascaderText }}
        <text :class="'iconfont ' + icon " />
      </view>
    </picker>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default () { return '' }
    },
    showKey: {
      type: String,
      default () { return 'name' }
    },
    dateTree: {
      type: Object,
      default () { return {} }
    },
    showText: {
      type: Function,
      default (array) { return array.map(item => item.name).join(' ') }
    }
  },
  data () {
    return {
      maxLevel: 1,
      dateArray: [],
      maxColumn: 0,
      feedback: [],
      multiIndex: [0],
      multiArray: [],
      cascaderText: '',
      icon: 'icon-down'
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      if (!this.dateTree.children) return
      this.libs.object.treeToList(this.dateTree, this.dateArray)
      let selected = this.dateArray.find(item => item.id === this.value)
      if (!selected) return console.log('找不到对象', this.value)
      console.log(selected)
      this.maxLevel = selected.level
      this.maxColumn = selected.level - 1
      await this.buildData(selected.id, selected.pid)
      this.$emit('getDefault', this.feedback)
    },
    async buildData (id, pid) {
      let multiArray = []
      let multiIndex = []
      for (let i = this.maxColumn; i > -1; i--) {
        //  处理回调数据
        this.feedback[i] = this.dateArray.find(item => item.id === id)
        // 生产当前级别数据
        let group = this.dateArray.filter(item => item.pid === pid)
        multiArray[i] = group.map(item => {
          return item[this.showKey] + (item.level === 2 ? '月' : '')
        })
        multiIndex[i] = group.findIndex(item => item.id === id)
        // 准备上级数据查找参数
        let target = this.dateArray.find(item => item.id === pid)
        pid = target.pid
        id = target.id
      }
      console.log(multiArray)
      this.multiArray = multiArray
      this.multiIndex = multiIndex
      this.cascaderText = this.showText(this.feedback)
    },
    getSelect (column, _value) {
      console.log(column, _value)
      let value = this.multiArray[column][_value]
      let level = column + 1
      let selected = this.dateArray.filter(item => {
        return item[this.showKey] + (item.level === 2 ? '月' : '') === value && item.level === level
      })
      if (selected.length > 1 && column > 0) {
        // 用上一级筛选同级重名数据
        let parentColumn = column - 1
        let parentValue = this.multiArray[parentColumn][this.multiIndex[parentColumn]]
        let parentLevel = parentColumn + 1
        let parent = this.dateArray.find(item => {
          return item[this.showKey] + (item.level === 2 ? '月' : '') === parentValue && item.level === parentLevel
        })
        console.log('启动父级筛查：', parent)
        selected = selected.filter(item => item.pid === parent.id)
      }
      return this.getLastSelect(selected[0])
    },
    getLastSelect (obj) {
      if (obj.level - 1 === this.maxColumn) return obj
      return this.getLastSelect(obj.children[0])
    },
    async onColumnchange (e) {
      let column = e.detail.column
      console.log(e)
      let obj = this.getSelect(column, e.detail.value)
      await this.buildData(obj.id, obj.pid)
    },
    onCancel () {
      this.icon = 'icon-down'
    },
    async onChange () {
      this.icon = 'icon-down'
      this.$emit('callBack', this.feedback)
    }
  }
}
</script>

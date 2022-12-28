<template>
  <view
    class="grid"
    :style="gridCss()"
  >
    <view class="corner">
      <uni-row class="tr">
        <uni-col
          class="td"
          :style="cornerCss()"
        >
          {{ dataTable[0].name }}
        </uni-col>
      </uni-row>
    </view>
    <view class="firstRow">
      <scroll-view
        scrollX="true"
        class="scrollHeader"
        :scrollLeft="scrollLeft"
        @scroll="(e)=>{onScroll('firstRow',e)}"
        :showScrollbar="false"
      >
        <uni-row
          class="tr"
          :style="{width:firstRowWidth+'px'}"
        >
          <uni-col
            class="td"
            v-for="item in dataTable.slice(1)"
            :key="item.id"
            :style="headerCss()"
          >
            {{ item.name }}
          </uni-col>
        </uni-row>
      </scroll-view>
    </view>
    <view class="firstColumn">
      <scroll-view
        :scrollY="true"
        class="scrollFirstColumn"
        :scrollTop="scrollTop"
        @scroll="(e)=>{onScroll('firstColumn',e)}"
      >
        <uni-row
          class="tr"
          v-for="(item,index) in firstColumnData()"
          :key="index"
        >
          <uni-col
            class="td"
            :style="firstColCss()"
          >
            <rich-text :nodes="item||''" />
          </uni-col>
        </uni-row>
      </scroll-view>
    </view>
    <view class="tbody">
      <scroll-view
        :scrollX="true"
        :scrollY="true"
        class="scrollBody"
        :scrollTop="scrollTop"
        :scrollLeft="scrollLeft"
        @scroll="(e)=>{onScroll('tbody',e)}"
      >
        <uni-row
          class="tr"
          v-for="obj in data"
          :key="obj.id"
          :style="{width:firstRowWidth+'px'}"
        >
          <uni-col
            class="td"
            v-for="item in dataTable.slice(1)"
            :key="item.id"
            :style="defaultCss()+item.style"
          >
            <view v-if="item.type==='rich'">
              <rich-text :nodes="obj[item.props]||''" />
            </view>
            <view v-else>
              {{ obj[item.props] }}
            </view>
          </uni-col>
        </uni-row>
      </scroll-view>
    </view>
  </view>
</template>

<script>
// 这个控件应该还有不少扩展的余地
export default {
  props: {
    dataTable: { // 注意这里的width只能用px做单位,冒号后面不要有空格
      type: Array,
      default () {
        return [
          { id: '0', name: '表头1', props: 'index', style: 'width:100px' },
          { id: '1', name: '表头2', props: 'name' },
          { id: '2', name: '表头3', props: 'age' },
          { id: '3', name: '表头4', props: 'sex' }
        ]
      }
    },
    data: {
      type: Array,
      default () {
        return [
          { id: '0', index: '0', name: '张三', age: '10', sex: 'man' },
          { id: '1', index: '1', name: '李四', age: '20', sex: 'woman' },
          { id: '2', index: '2', name: '王五', age: '30', sex: 'man' },
          { id: '3', index: '3', name: '赵六', age: '40', sex: 'man' },
          { id: '4', index: '0', name: '张三', age: '10', sex: 'man' },
          { id: '5', index: '1', name: '李四', age: '20', sex: 'woman' },
          { id: '6', index: '2', name: '王五', age: '30', sex: 'man' },
          { id: '7', index: '3', name: '赵六', age: '40', sex: 'man' },
          { id: '8', index: '0', name: '张三', age: '10', sex: 'man' },
          { id: '9', index: '1', name: '李四', age: '20', sex: 'woman' },
          { id: '10', index: '2', name: '王五', age: '30', sex: 'man' },
          { id: '11', index: '3', name: '赵六', age: '40', sex: 'man' }
        ]
      }
    },
    setting: { // 注意这里的width只能用px做单位,冒号后面不要有空格
      type: Object,
      default () {
        return {
          // tableWidth: '', // 表格宽度
          // tableHeight: '', // 表格高度
          // headerStyle: '', // 第一行样式
          // firstRowHeight: '80rpx', // 第一行高度
          // firstColumnWidth: '200rpx', // 第一列宽度
          // defaultWidth: '200rpx', // 默认单元格宽度
          // defaultHeight: '80rpx', // 默认单元格高度
          // scrollLeft: 100, // 默认横向滚动定位
          // scrollTop: 10// 默认纵向滚动定位
        }
      }
    }
  },
  data () {
    return {
      tableWidth: '',
      tableHeight: '',
      tbody: {
        width: 100,
        height: 100
      },
      headerStyle: '',
      firstRowHeight: '120rpx',
      firstColumnWidth: '80px',
      defaultWidth: '80px',
      defaultHeight: '120rpx',
      firstRowWidth: 300,
      scrollLeft: 0,
      scrollTop: 0
    }
  },
  created () {
    Object.keys(this.setting).forEach(key => {
      if (this.setting[key]) this[key] = this.setting[key]
    })
  },
  watch: {
    data: {
      handler () {
        this.scrollLeft = this.setting.scrollLeft
        this.scrollTop = this.setting.scrollTop
        this.init()
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const query = uni.createSelectorQuery().in(this)
      query.selectAll('.scrollHeader .td').boundingClientRect(data => {
        this.firstRowWidth = data.map(item => item.width).reduce((a, b) => a + b)
      }).exec()
      let grid = {}
      query.select('.grid').boundingClientRect(data => {
        grid = data
      }).exec()
      let corner = {}
      query.select('.corner').boundingClientRect(data => {
        corner = data
      }).exec()
      this.tbody = {
        width: grid.width - corner.width,
        height: grid.height - corner.height
      }
      this.gridCss('400px')
    },
    gridCss () {
      let _width = this.firstColCss().match(/width:\d+/img).map(item => item.slice(6) - 0)
      return `width:${this.tableWidth || '100%'};height:${this.tableHeight || '100%'};grid-template-columns: ${_width.slice(-1)}px ${this.tbody.width}px;grid-template-rows:${this.firstRowHeight} ${this.tbody.height}px;`
    },
    defaultCss () {
      return `width:${this.defaultWidth};height:${this.defaultHeight};line-height:${this.defaultHeight};text-align: center;`
    },
    headerCss () {
      return `${this.defaultCss()};height:${this.firstRowHeight};line-height:${this.firstRowHeight};${this.headerStyle}`
    },
    firstColumnData () {
      return this.data.map(item => item[this.dataTable[0].props])
    },
    firstColCss () {
      return `${this.defaultCss()};width:${this.firstColumnWidth};${this.dataTable[0].style}`
    },
    cornerCss () {
      return `${this.defaultCss()};${this.headerCss()};${this.firstColCss()}`
    },
    onScroll (type, e) {
      switch (type) {
        case 'tbody':
          this.scrollLeft = e.detail.scrollLeft
          this.scrollTop = e.detail.scrollTop
          break
        case 'firstRow':
          this.scrollLeft = e.detail.scrollLeft
          break
        case 'firstColumn':
          this.scrollTop = e.detail.scrollTop
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.grid {
  --grid-border: 1px solid #ddd;
  width: 100%;
  height: 100%;
  display: grid;
  background-color: #fff;
  border-top: var(--grid-border);
  .tr {
    .td {
      max-width: 100%;
      box-sizing: border-box;
      border-right: var(--grid-border);
      border-bottom: var(--grid-border);
    }
  }
  .scrollHeader {
    width: 100%;
  }
  .scrollFirstColumn {
    height: 100%;
  }
  .scrollHeader,
  .scrollFirstColumn {
    :deep(::-webkit-scrollbar) {
        display: none;
        width: 0 !important;
        height: 0 !important;
        -webkit-appearance: none;
        background: transparent;
      }

  }
  .scrollBody {
    width: 100%;
    height: 100%;
  }
}
</style>

<template>
  <div>
    <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">
        主要按钮
      </el-button>
      <el-button type="success">
        成功按钮
      </el-button>
      <el-button type="info">
        信息按钮
      </el-button>
      <el-button type="warning">
        警告按钮
      </el-button>
      <el-button type="danger">
        危险按钮
      </el-button>
    </el-row>
    <!-- <ve-pie :data="chartData"></ve-pie> -->
    <div
      id="myChart"
      :style="{ width: '300px', height: '300px' }"
    />
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {}
  },
  mounted () {
    // this.$root => app
    let myChart = this.$root.echarts.init(document.getElementById('myChart'))
    // 绘制图表
    myChart.setOption({
      title: { text: '总用户量' },
      tooltip: {},
      xAxis: {
        data: ['12-3', '12-4', '12-5', '12-6', '12-7', '12-8']
      },
      yAxis: {},
      series: [
        {
          name: '用户量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    })
  },
  created () {
    window.Y = this
  }
}
</script>

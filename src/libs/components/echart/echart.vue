<template>
  <div
    :id="config.id"
    :style="config.setStyle"
  />
</template>
<script>
// 热更新可能会出现错误，需要刷新页面
export default {
  name: 'EChart',
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    config: {
      type: [Object, String, Array],
      default: () => {
        return {
          setStyle: { width: '300px', height: '300px' }
        }
      }
    }
  },
  data () {
    return {
      eChart: ''
    }
  },
  watch: {
    option: {
      handler () {
        this.init()
      },
      deep: true
    }
  },
  created () {
    // let eChart = this.$root.echarts.init(document.getElementById("eChart"));
    // // 绘制图表
    // eChart.setOption(this.option);
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.eChart) {
        this.eChart = this.$root.echarts.init(
          document.getElementById(this.config.id)
        )
      }
      // 绘制图表
      this.eChart.setOption(this.option)
    }
  }
}
</script>

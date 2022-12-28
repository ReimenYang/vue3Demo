<template>
  <mescroll-uni
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    @up="config.updateList"
    :down="down"
    :up="up"
    :fixed="config.fixed"
    :height="config.height"
    :top="config.top"
    :topbar="config.topbar"
    :bottom="config.bottom"
    :bottombar="config.bottombar"
    :safearea="config.safearea"
  >
    <slot />
  </mescroll-uni>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
export default {
  name: 'XnwList',
  mixins: [MescrollMixin],
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          fixed: true,  // 是否通过fixed定位来固定mescroll-uni的高度,默认true; (mescroll-body不生效,因为无需固定高度)。当配置:fixed="false"时,则mescroll-uni高度跟随父元素, 此时父元素必须有固定的高度,否则列表滚动异常。所以不想使用fixed, 建议通过flex固定高度 或 配置height来固定mescroll-uni的高度
          height: '',   // 对mescroll-uni可简单快捷设置的高度, 此项有值,则不使用fixed.对mescroll-body可设置最小高度,默认100%,使列表不满屏仍可下拉
          top: 0,   // 下拉刷新区域往下偏移的距离
          topbar: false,  // top的偏移量是否加上状态栏高度
          bottom: 0,  // 上拉加载区域往上偏移的距离
          bottombar: true,  // tab页是否偏移TabBar的高度,避免列表被TabBar遮住, 默认true
          safearea: false,  // bottom的偏移量是否加上底部安全区的距离,
          updateList: () => {
            console.log('自定义上拉加载方法')
          }
        }
      }
    },
    down: {
      type: Object,
      default: () => {
        return {
          use: true,  // 是否启用下拉刷新
          auto: false,   // 是否在初始化完毕之后自动执行一次下拉刷新的回调 callback
          native: false,  // 是否使用系统自带的下拉刷新; 默认false; 仅mescroll-body生效值为true时,需在pages配置"enablePullDownRefresh":true 和 "mp-alipay":{"allowsBounceVertical":"YES"}
          textInOffset: '下拉刷新',   // 下拉的距离在offset范围内的提示文本
          textOutOffset: '释放更新',  // 下拉的距离大于offset范围的提示文本
          textLoading: '加载中 ...',   // 加载中的提示文本
          textSuccess: '加载成功',  // 加载成功的提示文本
          textErr: '加载失败',  // 加载失败的提示文本
          beforeEndDelay: 100,  // 延时结束的时长, 也是显示加载成功/失败的时长; 单位ms
          bgColor: 'transparent',   // 下拉区域背景颜色
          textColor: 'gray',  // 下拉文本的颜色
          autoShowLoading: false,   // 如果设置auto=true ( 在初始化完毕之后自动执行下拉刷新的回调 ) ,那么是否显示下拉刷新的进度 需配置down的callback才生效
          isLock: false,  // 是否锁定下拉刷新 如果配置true,则会锁定不可下拉,可通过调用mescroll.lockDownScroll(false)解锁
          offset: 80,   // 在列表顶部,下拉大于80px,松手即可触发下拉刷新的回调
          inOffsetRate: 1,  // 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
          outOffsetRate: 0.2,   // 在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例; 值越接近0,高度变化越小,表现为越往下越难拉
          bottomOffset: 20,   // 当手指touchmove位置在距离body底部20px范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
          minAngle: 45,   // 触发下拉最少要偏移的角度(滑动的轨迹与水平线的锐角值),取值区间 [0,90]; 默认45度,即向下滑动的角度大于45度(方位角为45°~145°及225°~315°)则触发下拉; 而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突
        }
      }
    },
    up: {
      type: Object,
      default: () => {
        return {
          use: true,  // 是否启用上拉加载
          auto: true,   // 是否在初始化完毕之后自动执行一次上拉加载的回调 当配置为false时,建议down的auto也为false,因为downCallback默认调用resetUpScroll,最终还会触发upCallback 如果是想实现返回刷新页面,那么其实不需要设置auto为false
          page: {
            num: 0,
            size: 10,
            time: null
          },
          noMoreSize: 10,   // 如果列表已无数据,可设置列表的总数量要大于5条才显示无更多数据
          textLoading: '加载中 ...',   // 上拉加载中的文本
          textNoMore: '-- END --',  // 没有更多数据的提示文本
          bgColor: 'transparent',   // 下拉区域背景颜色
          textColor: 'gray',  // 下拉文本的颜色
          toTop: {
            src: null,
            offset: 1000,
            duration: 300,
            zIndex: 9990,
            right: 20,
            bottom: 120,
            safearea: false,
            width: 72,
            radius: '50%',
            left: null
          },
          empty: {
            use: true,
            icon: null,
            tip: '暂无相关数据',
            btnText: '',
            fixed: false,
            top: '100rpx',
            zIndex: 99
          },
          isBoth: false,  // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新
          isLock: false,  // 是否锁定上拉加载 如果配置true,则会锁定不可上拉,可通过调用mescroll.lockUpScroll(false)解锁
          offset: 150,  // 距底部多远时,触发upCallback ;
          onScroll: false,  // 是否监听滚动事件, 默认false (仅mescroll-uni可用;mescroll-body是页面的onPageScroll)
        }
      }
    }
  },
  methods: {

  }
}
</script>

<style>
</style>

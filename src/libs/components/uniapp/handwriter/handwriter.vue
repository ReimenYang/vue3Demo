<template>
  <view :class="handwriterClass">
    <canvas
      class="drawCanvas"
      canvas-id="drawCanvas"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
    />
    <canvas
      class="handwriter_copy"
      type="2d"
      canvas-id="copyCanvas"
    />
    <view class="footer">
      <view class="left">
        <view
          class="close iconfont icon-left"
          @click="close"
        />
        <view class="placeholder">
          {{ placeholder }}
        </view>
      </view>
      <view class="right">
        <view
          class="clear btn"
          :style="'color:' + btnColor "
          @click="clear"
        >
          清除
        </view>
        <view
          class="finish btn"
          @click="finish"
          :style="'background-color: ' + btnColor "
        >
          保存
        </view>
      </view>
    </view>
  </view>
</template>

<script>
	import './handwriter.scss'
	export default {
		props: {
			setClass: {
				type: Array,
				default () {
					return []
				}
			},
			btnColor: {
				type: String,
				default: 'orange'
			},
			placeholder: {
				type: String,
				default: '请在下方空白处书写'
			},
			lineWidth: {
				type: Number,
				default: 5
			},
			lineCap: {
				type: String, // ['butt', 'round', 'square'],
				default: 'round'
			},
			lineJoin: {
				type: String, // ['bevel', 'round', 'miter'],
				default: 'round'
			},
			strokeStyle: {
				type: String,
				default: '#f00'
			},
			onConfirm: {
				type: Function
			},
			onClose: {
				type: Function
			}
		},
		data () {
			return {
				ctx: '', // 绘图图像
				points: [], // 路径点集合
				signature: '',
				copyCanvas: '',
				emptyTempPath: '',
				copyTempPath: '',
				scale: 3,
				count: 0,
				maxCount: 10
			}
		},
		computed: {
			handwriterClass: function (){
			  return ['signature', ...this.setClass]
		  }
		},
		mounted () {
			this.createCanvas()
		},
		methods: {
			// 关闭并清空画布
			close () {
				this.showCanvas = false
				this.clear()
			},
			// 创建并显示画布
			createCanvas () {
				this.ctx = uni.createCanvasContext('drawCanvas', this) // 创建绘图对象
				this.copyCanvas = uni.createCanvasContext('copyCanvas', this)
				this.doCopy()
				// 设置画笔样式
				this.ctx.lineWidth = this.lineWidth
				this.ctx.lineCap = this.lineCap
				this.ctx.lineJoin = this.lineJoin
				this.ctx.strokeStyle = this.strokeStyle
			},
			// 触摸开始，获取到起点
			touchstart (e) {
				const touch = event.touches[0]
				let startPoint = {
					X: event.x,
					Y: event.y
				}
				this.points.push(startPoint)
				// 每次触摸开始，开启新的路径
				this.ctx.beginPath()
			},

			// 触摸移动，获取到路径点
			touchmove (e) {
				let moveX = e.changedTouches[0].x
				let moveY = e.changedTouches[0].y
				let movePoint = {
					X: moveX,
					Y: moveY
				}
				this.points.push(movePoint) // 存点
				let len = this.points.length
				if (len >= 2) {
					this.draw() // 绘制路径
				}

			},

			// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
			touchend () {
				this.points = []
			},

			/* ***********************************************
			#   绘制笔迹
			#	1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#	2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#	3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
			draw () {
				let point1 = this.points[0]
				let point2 = this.points[1]
				this.points.shift()
				this.ctx.moveTo(point1.X, point1.Y)
				this.ctx.lineTo(point2.X, point2.Y)
				this.ctx.stroke()
				this.ctx.draw(true)
			},

			// 清空画布
			clear () {
				const that = this
				uni.getSystemInfo({
					success: (res) => {
						let canvasw = res.windowWidth
						let canvash = res.windowHeight
						that.ctx.clearRect(0, 0, canvasw, canvash)
						that.ctx.draw(true)
					},
				})
			},
			// 完成绘画并保存到本地
			finish () {
				console.log('开始生成签名')
				console.time()
				let that = this
				uni.canvasToTempFilePath({
					canvasId: 'drawCanvas',
					success: (res) => {
						that.toDataURL = res.tempFilePath
						let img={ width: that.WindowWidth, height: that.WindowHeight }
						const angle = Math.PI * 90 / 180
						that.copyCanvas.translate(img.height, 0)
						that.copyCanvas.rotate(angle)
						that.copyCanvas.drawImage(res.tempFilePath, 0, 0, img.width*that.scale, img.height*that.scale, 0, 0, img.width, img.height)
						that.copyCanvas.draw()
						that.doCopy()
					}
				})
			},
			doCopy (){
				if (this.maxCount <= this.count) return
				const that = this
				uni.canvasToTempFilePath({
					canvasId: 'copyCanvas',
					success: (res) => {
						if (!that.emptyTempPath) return that.emptyTempPath = res
						that.count++
						console.log('生成次数：', that.count)
						that.copyTempPath = res
						if (!that.copyTempPath || that.copyTempPath.tempFilePath === that.emptyTempPath.tempFilePath) return setTimeout(that.doCopy, 500)
						console.log('生产成功')
						console.timeEnd()
						that.count = 0
						console.log(res)

						// 上传到服务器
						// that.api.uploadFile({
						// 	url: 'user/upload/one',
						// 	filePath: res.tempFilePath,
						// 	name: 'file',
						// 	success: (uploadFileRes) => {
						// 		console.log(uploadFileRes)
						// 		that.clear();
						// 	}
						// })
						// 保存到本地
						// let path = res.tempFilePath;
						// uni.saveImageToPhotosAlbum({
						// 	filePath:path,
						// })
						// 返回图片
						// 。。。
					}
				})
			}
		}
	}
</script>

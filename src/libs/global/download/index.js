/**
 * Downloader模块管理网络文件下载任务 https://www.html5plus.org/doc/zh_cn/downloader.html
 *
 * filename: (String 类型 )下载文件保存的路径
 * 保存文件路径仅支持以"_downloads/"、"_doc/"、"_documents/"开头的字符串。
 * 文件路径以文件后缀名结尾（如"_doc/download/a.doc"）表明指定保存文件目录及名称，
 * 以“/”结尾则认为指定保存文件的目录（此时程序自动生成文件名）。
 * 如果指定的文件已经存在，则自动在文件名后面加"(i)"，其中i为数字，
 * 如果文件名称后面已经是此格式，则数字i递增，如"download(1).doc"。
 * 默认保存目录为（"_downloads"），并自动生成文件名称。
 *
 * uni.downloadFile与uni.saveFile组合使用只能下载文件到指定位置
 * 这个方法可以将文件下载到相对路径下的任意位置,如果目录不存在，会自动创建目录
 * 此处多文件会触发并发下载
 * 未下载完的文件也会被创建
 *
 * plus.downloader.enumerate
 * 先调用plus.downloader.clear，再调用plus.downloader.startAll，返回本次下载的任务列表
 * 单独调用相当于下载历史记录，属于持久化管理
 *
*/
// 用于getProgress记录上次调用的下载情况，以便计算下载速度和时间
let old = []

let baseModule = {
  async getFiles (list) {
    plus.downloader.clear()
    list.forEach(({ url, option }) => {
      plus.downloader.createDownload(
        url,
        option,
        (d, status) => {
          // 下载完成
          if (status === 200) {
            let { id, state, filename, options, downloadedSize, totalSize } = d
            console.log('Download对象管理一个下载任务', id, state, d.url, filename, options, downloadedSize, totalSize)
          } else {
            console.log('Download failed2: ' + status)
          }
        })
    })

    plus.downloader.startAll()
    return new Promise(resolve => {
      // 返回本次下载的任务列表
      plus.downloader.enumerate(tasks => resolve(tasks))
    })
  },
  // 暂停下载任务
  async pause (id) {
    let history = await baseModule.getHistory()
    let dtask = history.find(item => item.id === id)
    dtask.pause()
  },
  // 取消下载任务
  async abort (id) {
    let history = await baseModule.getHistory()
    let dtask = history.find(item => item.id === id)
    dtask.abort()
  },
  // 下载历史记录
  async getHistory () {
    return new Promise(resolve => {
      // 下载历史记录，属于持久化管理
      plus.downloader.enumerate(tasks => resolve(tasks.filter(item => item.state !== -1 && item.state !== -1000)))
    })
  },
  // 断点续传
  async startResume (list) {
    // plus.downloader.clear()
    if (!list) list = await baseModule.getHistory()
    console.log(111111111111, list)
    list.filter(item => item.state !== -1 && item.state !== 4 && item.state !== -1000).forEach(item => item.start())
    return list
  },
  // 计算大小，如文件大小，下载速度
  // 单文件下载利用监听tasks.state===3时候downloadedSize数值的变化
  // 多文件需要先对所有tasks.state===3的downloadedSize求和再计算
  fileSize (size) {
    const rule = {
      G: 1024 ** 3,
      M: 1024 ** 2,
      K: 1024
    }
    for (const key in rule) {
      if (size > rule[key]) return (size / rule[key]).toFixed(2) + key
    }
  },
  // 实时下载信息
  // 结合addEventListener或者轮询使用
  // 速度，总量，已下载，剩余量，剩余时间，百分比
  async getProgress (list) {
    let ids = list.map(item => item.id)
    let history = await baseModule.getHistory()
    let downloading = history.filter(item => ids.includes(item.id))
    if (!old.length) old = JSON.parse(JSON.stringify(downloading))
    let _speed = 0,
      _remainTime = 0,
      _remainSize = 0,
      _totalSize = 0,
      _downloadedSize = 0,
      _progress = 100
    // 单个下载任务情况
    downloading.forEach(newItem => {
      // eslint-disable-next-line no-unused-vars
      let { id, totalSize = 0, downloadedSize } = newItem
      newItem.remainSize = totalSize - downloadedSize
      if (newItem.remainSize <= 0) return

      _totalSize += totalSize
      _downloadedSize += downloadedSize

      _remainSize += newItem.remainSize

      newItem.progress = (downloadedSize / totalSize * 100).toFixed(2)

      let oldItem = old.find(item => item.id === id)
      newItem.speed = downloadedSize - oldItem.downloadedSize

      _speed += newItem.speed
      if (newItem.speed) newItem.remainTime = (newItem.remainSize / newItem.speed).toFixed(0)
    })

    if (_speed) _remainTime = (_remainSize / _speed).toFixed(0)

    if (_totalSize) _progress = (_downloadedSize / _totalSize * 100).toFixed(2)

    old = JSON.parse(JSON.stringify(downloading))
    if (_progress === 100) old = []
    // 下载总览
    let intro = {
      speed: _speed,
      remainTime: _remainTime,
      remainSize: _remainSize,
      totalSize: _totalSize,
      downloadedSize: _downloadedSize,
      progress: _progress
    }
    return { downloading, intro }
  }
}
export default baseModule

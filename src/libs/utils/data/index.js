import object from '../object'
import initUni from './uni'
import page from './page'
import verify from './verify'
import { Interpreter } from 'eval5'
import { framework } from '@/projectConfig.js'

let data = async () => {
  if (framework === 'uni') {
    let obj = await initUni()
    for (let key in obj) {
      data[key] = obj[key]
    }
    console.log(data.networkType)
  }
}
if (framework === 'uni') {
  data.systemInfo = uni.getSystemInfoSync()
  data.processEnv = process.env
}
const s = 1000 // 秒
const m = s * 60 // 分
const h = m * 60 // 时
const d = h * 24 // 日
const month = d * 30 // 月
const y = d * 365 // 年

// 日期转换
data.dateFormat = (dataTime, format = 'xxxx-xx-xx xx:xx:xx') => {
  // 日期格式化：20201016102224=>2020-10-16 10:22:24
  if (!dataTime) return
  if (typeof dataTime === 'string') {
    dataTime.split('').forEach(str => {
      format = format.replace(/x/, str)
    })
    return format
  }
}
// ios日期格式转化
data.dateIOSFormat = str => {
  if (typeof str === 'string')
    return new Date(str.replace(/-/g, '/')).valueOf()
  return str
}

// 时间差转换
data.timeDifference = (time, str = '') => {
  if (time >= y) str += parseInt(time / y) + '年'
  time = time % y
  if (time >= month) str += parseInt(time / month) + '月'
  time = time % month
  if (time >= d) str += parseInt(time / d) + '天'
  time = time % d
  if (time >= h) str += parseInt(time / h) + '时'
  time = time % h
  if (time >= m) str += parseInt(time / m) + '分'
  time = time % m
  if (time >= s) str += parseInt(time / s) + '秒'
  return str
}
// 当前日期
data.dateNow = (dataTime, format) => {
  const now = dataTime ? new Date(dataTime) : new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let date = now.getDate()
  let hour = now.getHours()
  let minute = now.getMinutes()
  let second = now.getSeconds()
  return data.dateFormat(
    (
      year +
      (month < 10 ? '0' + month : '' + month) +
      (date < 10 ? '0' + date : '' + date) +
      (hour < 10 ? '0' + hour : '' + hour) +
      (minute < 10 ? '0' + minute : '' + minute) +
      (second < 10 ? '0' + second : '' + second)
    ).replace(/[-|:]/gim, ''),
    format
  )
}

// 获取随机数
data.random = n => {
  return (
    Math.floor(Math.random() * (10 ** n - 1 - 10 ** (n - 1))) + 10 ** (n - 1)
  )
}
// 写缓存
data.setStorage = (name, value) => {
  if (window) {
    if (typeof value === 'object') value = JSON.stringify(value)
    return localStorage.setItem(name, value)
  }
  return uni.setStorageSync(name, value)
}
// 读缓存
data.getStorage = name => {
  if (window) return localStorage[name]
  return uni.getStorageSync(name)
}
// 删除缓存
data.removeStorage = name => {
  return uni.removeStorageSync(name)
}
// 写Session
data.setSession = (name, value) => {
  if (window) {
    if (typeof value === 'object') value = JSON.stringify(value)
    sessionStorage.setItem(name, value)
  }
}
// 读Session
data.getSession = name => {
  if (window) return sessionStorage[name]
}
// 写cookie
data.setCookie = (name, value, expires) => {
  if (window)
    document.cookie = name + '=' + escape(value) + ';expires=' + expires
}
// 读cookie
data.getCookie = name => {
  if (window) return object.paramsToKeyValue(document.cookie, '; ')[name]
}
// eval 类似window的eval函数，str：字符串化的执行代码，obj：一般情况下传入vue的实例this，如果有特殊需求可以自定义传入
data.eval = (str, obj) => {
  let rootContext
  // #ifdef H5
  if (window) rootContext = window
  // #endif

  // #ifdef MP-WEIXIN
  if (getApp().globalData) rootContext = getApp().globalData
  // #endif
  const interpreter = new Interpreter(obj, {
    rootContext,
    timeout: 1000,
    ecmaVersion: 7
  })
  try {
    return interpreter.evaluate(str)
  } catch (e) {
    console.log(e)
  }
}
data.createNonceStr = (length = 16) => {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let str = ''
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)]
  }
  return str
}
data.encodeUTF8 = (s) => {
  let i, r = [], c, x
  for (i = 0; i < s.length; i++)
    c = s.charCodeAt(i)
  if (c < 0x80) r.push(c)
  else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F))
  else {
    x = c ^ 0xD800
    if (x >> 10 === 0) // 对四字节UTF-16转换为Unicode
      c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
        r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F))
    else r.push(0xE0 + (c >> 12 & 0xF))
    r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F))
  }
  return r
}
// 字符串加密成 hex 字符串
data.sha1 = (str) => {
  let data = new Uint8Array(this.encodeUTF8(str))
  let i, j, t
  let l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2)
  s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer)
  for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2)
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8)
  s[l - 1] = data.length << 3
  let w = [], f = [
    function () { return m[1] & m[2] | ~m[1] & m[3] },
    function () { return m[1] ^ m[2] ^ m[3] },
    function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3] },
    function () { return m[1] ^ m[2] ^ m[3] }
  ], rol = function (n, c) { return n << c | n >>> (32 - c) },
    k = [1518500249, 1859775393, -1894007588, -899497514],
    m = [1732584193, -271733879, null, null, -1009589776]
  m[2] = ~m[0], m[3] = ~m[1]
  for (i = 0; i < s.length; i += 16) {
    let o = m.slice(0)
    for (j = 0; j < 80; j++)
      w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
        t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
        m[1] = rol(m[1], 30), m.pop(), m.unshift(t)
    for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0
  }
  t = new DataView(new Uint32Array(m).buffer)
  for (let i = 0; i < 5; i++)m[i] = t.getUint32(i << 2)

  let hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
    return (e < 16 ? '0' : '') + e.toString(16)
  }).join('')
  return hex
}

data.listFormat = ({
  records: list,
  current: currentPage = 1,
  size: pageSize = 20,
  total
}) => {
  return {
    list,
    pagination: { currentPage, pageSize, total }
  }
}
data.page = page
data.verify = verify

export default data

'use strict'

let table

function initGbkTable () {
  // https://en.wikipedia.org/wiki/GBK_(character_encoding)#Encoding
  const ranges = [
    [0xA1, 0xA9, 0xA1, 0xFE],
    [0xB0, 0xF7, 0xA1, 0xFE],
    [0x81, 0xA0, 0x40, 0xFE],
    [0xAA, 0xFE, 0x40, 0xA0],
    [0xA8, 0xA9, 0x40, 0xA0],
    [0xAA, 0xAF, 0xA1, 0xFE],
    [0xF8, 0xFE, 0xA1, 0xFE],
    [0xA1, 0xA7, 0x40, 0xA0],
  ]
  const codes = new Uint16Array(23940)
  let i = 0

  for (const [b1Begin, b1End, b2Begin, b2End] of ranges) {
    for (let b2 = b2Begin; b2 <= b2End; b2++) {
      if (b2 !== 0x7F) {
        for (let b1 = b1Begin; b1 <= b1End; b1++) {
          codes[i++] = b2 << 8 | b1
        }
      }
    }
  }
  table = new Uint16Array(65536)
  table.fill(0xFFFF)

  const str = new TextDecoder('gbk').decode(codes)
  for (let i = 0; i < str.length; i++) {
    table[str.charCodeAt(i)] = codes[i]
  }
}


const NodeJsBufAlloc = typeof Buffer === 'function' && Buffer.allocUnsafe

const defaultOnAlloc = NodeJsBufAlloc
  ? (len) => NodeJsBufAlloc(len)
  : (len) => new Uint8Array(len)

const defaultOnError = () => 63   // '?'

function str2gbk (str, opt = {}) {
  if (!table) {
    initGbkTable()
  }
  const onAlloc = opt.onAlloc || defaultOnAlloc
  const onError = opt.onError || defaultOnError

  const buf = onAlloc(str.length * 2)
  let n = 0

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code < 0x80) {
      buf[n++] = code
      continue
    }
    const gbk = table[code]

    if (gbk !== 0xFFFF) {
      buf[n++] = gbk
      buf[n++] = gbk >> 8
    } else if (code === 8364) {
      // 8364 == '€'.charCodeAt(0)
      // Code Page 936 has a single-byte euro sign at 0x80
      buf[n++] = 0x80
    } else {
      const ret = onError(i, str)
      if (ret === -1) {
        break
      }
      if (ret > 0xFF) {
        buf[n++] = ret
        buf[n++] = ret >> 8
      } else {
        buf[n++] = ret
      }
    }
  }
  return buf.subarray(0, n)
}
function utf8to16 (str) {
  let char2, char3
  let out = ''
  let i = 0
  while (i < str.length) {
    let c = str.charCodeAt(i++)
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1)
        break
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = str.charCodeAt(i++)
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
        break
      case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
        char2 = str.charCodeAt(i++)
        char3 = str.charCodeAt(i++)
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0))
        break
    }
  }
  return out
}

function utf16to8 (str) {
  let out = ''
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}
export default { str2gbk, utf8to16, utf16to8 }
/** 使用方法
 * import {str2gbk} from './gbk.js'
 * let str='中国'
 * const gbkBuf = str2gbk(str) //[214,208,185,250]
 * let gbk=new TextDecoder('gbk').decode(new Uint8Array(gbkBuf))
 */

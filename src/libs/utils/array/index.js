let array = {}
// 数组去重
array.unique = (arr, func = a => a) => {
  let rt = []
  let hasKeys = []
  arr.forEach(a => {
    let key = func(a)
    if (hasKeys.indexOf(key) === -1) {
      hasKeys.push(key)
      rt.push(a)
    }
  })
  return rt
}
// 数组计算重复量
array.countRepeat = (arr, key) => {
  return arr.reduce(function (allKeys, item) {
    let _key = item[key] || item
    if (_key in allKeys) {
      allKeys[_key]++
    }
    else {
      allKeys[_key] = 1
    }
    return allKeys
  }, {})
}
// 数组查重,注意：这里数组返回的之一定是字符串
array.getRepeat = (arr, key, n = 1) => {
  let _obj = array.countRepeat(arr, key)
  return Object.keys(_obj).filter(key => _obj[key] > n)
}
// 数组交集
array.intersection = (arrA, keyA, arrB, keyB) => {
  return arrA.filter(a => arrB.some(b => (keyB ? b[keyB] : b) === (keyA ? a[keyA] : a)))
}
// 数组并集并去重
array.unionSet = (arrA, arrB, key) => {
  return array.unique([...arrA, ...arrB], item => key ? item[key] : item)
}
// 数组转换值
array.getLabel = (val, arr, valKey = 'value', labelKey = 'label') => {
  const _obj = arr.find(item => item[valKey] === val)
  if (_obj) return _obj[labelKey] || val
  console.error('找不到需要转换的对象')
  return val
}
// 降维
array.flat = (arr, key) => {
  return arr.map(item => (key ? item[key] : item)).reduce((a, b) => [...a, ...b])
}
export default array

let object = {}
// 判断是否对象
object.isObject = data => {
  return typeof data === 'object' && data.length === undefined
}

// 递归对象转数组
object.treeToList = (
  data,
  array = [],
  pid = 0,
  nodeName = 'children',
  getPid = 'id',
  setPid = 'pid',
  level = 0
) => {
  data[setPid] = pid
  data.level = level
  array.push(data)
  if (data[nodeName]) {
    data[nodeName].forEach(item => {
      object.treeToList(item, array, data[getPid], nodeName, getPid, setPid, level + 1)
    })
  }
}
// 递归对象加属性
object.treeAddKey = (
  data,
  addKey,
  setValue,
  fromKey,
  nodeName = 'children'
) => {
  if (!addKey) return
  data[addKey] = setValue || data[fromKey]
  if (data[nodeName]) {
    data[nodeName].forEach(item => {
      object.treeAddKey(item, addKey, setValue, fromKey, nodeName)
    })
  }
}
// 对象多级取值
object.getValue = (str, data, n = 0, item) => {
  let keys = str.split('.')
  if (typeof data !== 'object' || keys.length - 1 <= n) {
    // 判断是否多级取值
    // 判断是否要转换值
    //   if (item.transform) return this.getName(data[keys[n]], item.transform)
    //   if (item.format) return this.formatDate(data[keys[n]])
    return data[keys[n]]
  }
  return object.getValue(str, data[keys[n]], n + 1, item)
}
// 对象转KeyValue
object.paramsToKeyValue = data => {
  if (!object.isObject(data)) return ''
  let keyValue = ''
  Object.keys(data).forEach(key => {
    keyValue += `&${key}=${data[key]}`
  })
  return keyValue.slice(1)
}
// KeyValue转对象
object.keyValueToParams = (data, str = '&') => {
  if (!data || typeof data !== 'string') return {}
  let obj = {}
  data.split(str).forEach(item => {
    let _arr = item.split('=')
    obj[_arr[0]] = _arr[1]
  })
  return obj
}
export default object

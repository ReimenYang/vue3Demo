/**
 * IO模块管理本地文件系统 https://www.html5plus.org/doc/zh_cn/io.html
 */
// PRIVATE_WWW 应用私有资源目录，对应常量plus.io.PRIVATE_WWW,仅应用自身可读，对应相对路径URL为"_www"开头的地址，理解为app运行文件
// PRIVATE_DOC 应用私有文档目录，对应常量plus.io.PRIVATE_DOC,仅应用自身可读写，对应相对路径URL为"_doc"开头的地址，理解为本地数据库或其他自定义内容
// PUBLIC_DOCUMENTS 应用公共文档目录，对应常量plus.io.PUBLIC_DOCUMENTS,多应用时都可读写，常用于保存应用间共享文件，对应相对路径URL为"_documents"开头的地址
// PUBLIC_DOWNLOADS 应用公共下载目录，对应常量plus.io.PUBLIC_DOWNLOADS,多应用时都可读写，常用于保存下载文件，对应相对路径URL为"_downloads"开头的地址

// requestFileSystem 和 resolveLocalFileSystemURL 的区别
// requestFileSystem 的 fs.root 相当于 resolveLocalFileSystemURL 的 entry ，是根目录操作对象 DirectoryEntry
// requestFileSystem 路径使用常量
// resolveLocalFileSystemURL 路径使用相对路径URL
function getEntry (path) {
  return new Promise(resolve => {
    plus.io.resolveLocalFileSystemURL(
      path,
      entry => resolve({ entry }),
      err => {
        uni.showToast({
          title: '获取对象出错' + path,
          duration: 2000
        })
        console.error('获取目录对象或文件对象出错:', path, err)
        resolve({ err: err.message })
      }
    )
  })
}

let baseModule = {
  // 获取文件夹文件列表
  async readEntries (path) {
    let { entry, err } = await getEntry(path)
    return new Promise(resolve => {
      if (err) return resolve({ statusCode: 500, err })
      let directoryReader = entry.createReader()
      directoryReader.readEntries(
        _data => {
          let data = _data
          // data = _data.map(({ name, isFile, isDirectory, __PURL__ }) => ({ name, isFile, isDirectory, __PURL__ }))
          console.log('获取文件夹文件列表', data)
          resolve({ statusCode: 200, data })
        }
      )
    })
  },
  // 有文件就读文件，没文件就创建文件，重点作用是创建
  async fileCreate (path, fileName) {
    let { entry, err } = await getEntry(path)
    return new Promise(resolve => {
      if (err) return resolve({ statusCode: 500, err })
      entry.getFile(
        fileName,
        { create: true },
        entry => {
          entry.file(file => {
            let fileReader = new plus.io.FileReader()
            console.log('创建文件信息：', file)
            fileReader.readAsText(file, 'utf-8')
            fileReader.onloadend = data => {
              console.log('创建文件内容：', data.target.result)
              resolve({ statusCode: 200, data: { file, data } })
            }
          })
        }
      )
    })
  },
  // 只会读取文件
  async fileReader (path) {
    let { entry, err } = await getEntry(path)
    return new Promise(resolve => {
      if (err) return resolve({ statusCode: 500, err })
      entry.file(
        file => {
          let fileReader = new plus.io.FileReader()
          console.log('读取文件信息：', file)
          fileReader.readAsText(file, 'utf-8')
          fileReader.onloadend = data => {
            console.log('读取文件内容：', data.target.result)
            resolve({ statusCode: 200, data: { file, data } })
          }
        }
      )
    })
  },
  // 编辑文件内容
  async fileWriter (path, content, seek) {
    let { entry, err } = await getEntry(path)
    return new Promise(resolve => {
      if (err) return resolve({ statusCode: 500, err })
      // Write data to file
      entry.createWriter(
        writer => {
          writer.onwrite = data => {
            console.log('写入成功：', data.target.readyState, data.target.result)
            resolve({ statusCode: 200, data })
          }
          // 从哪里开始插入内容，不设置则删掉所有内容，并用新内容填充，Write data to the end of file.
          if (seek && seek !== 0) writer.seek(writer.length)
          // 写入内容
          if (typeof (content) !== 'string') content = JSON.stringify(content)
          writer.write(content)
        },
        err => {
          uni.showToast({
            title: '写入失败' + path,
            duration: 2000
          })
          console.error('写入失败', err.message)
          resolve({ statusCode: 500, err })
        })
    })
  },
  // 删除文件
  async fileRemove (path) {
    let { entry, err } = await getEntry(path)
    return new Promise(resolve => {
      if (err) return resolve({ statusCode: 500, err })
      entry.remove(
        data => {
          console.log('删除文件成功：', data)
          resolve({ statusCode: 200, data })
        },
        err => {
          console.error('删除文件失败：', err)
          resolve({ statusCode: 500, err })
        }
      )
    })
  },
  // 创建或打开子目录
  async dirCreate (path, name) {
    let { entry, err } = await getEntry(path)
    return new Promise(resolve => {
      if (err) return resolve({ statusCode: 500, err })
      entry.getDirectory(
        name,
        { create: true, exclusive: false },
        data => {
          console.log('创建文件夹成功：', data)
          resolve({ statusCode: 200, data })
        },
        err => {
          console.error('创建文件夹失败：', err)
          resolve({ statusCode: 500, err })
        }
      )
    })
  },
  // 清空目录
  async dirClear (path) {
    let { entry, err } = await getEntry(path)
    return new Promise(resolve => {
      if (err) return resolve({ statusCode: 500, err })
      entry.removeRecursively(
        data => {
          console.log('清空文件夹成功：', data)
          resolve({ statusCode: 200, data })
        },
        err => {
          console.error('清空文件夹失败：', err)
          resolve({ statusCode: 500, err })
        }
      )
    })
  }
}
export default baseModule

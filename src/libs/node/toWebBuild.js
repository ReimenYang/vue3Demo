const Path = require('path')
const fs = require('fs')
const svnUltimate = require('node-svn-ultimate')
const svn = svnUltimate.commands
const { projectName, framework } = require('../../projectConfig.js')
let buildMode = 'test'

let buildPath, toPath, buildRootDir
switch (framework) {
  case 'uni':
    buildPath = '../unpackage/dist/build/h5'
    buildRootDir = Path.resolve('../../../webBuild')
    break
  case 'vue':
    buildPath = '../../dist'
    buildRootDir = Path.resolve('../../../../webBuild')
    break
}
if (!buildPath) return console.log('框架设置有误')

// toPath = buildRootDir + '\\' + buildMode + '\\' + projectName

// const projectList = {
//   wyjk: '网约家康公众号', // 网约家康公众号
//   questionnaires: '问卷系统', // 问卷系统
//   healthGame: '英雄大赛202104', // 英雄大赛202104
//   wyjkWeb: '网约家康官网电脑端', // 网约家康官网电脑端
//   wyjkWap: '网约家康官网移动端', // 网约家康官网移动端
//   enterMiniApp: '会议报名小程序', // 会议报名小程序
//   registerMiniApp: '会议报到小程序', // 会议报到小程序
//   xnwWap: '玺诺王官网移动端', // 玺诺王官网移动端
//   xnwWeb: '玺诺王官网电脑端', // 玺诺王官网电脑端
//   xnwApp: '药豆', // 药豆
//   treatmentCloud: '智慧云', // 智慧云
//   reportForWorkWX: '企业微信报表', // 企业微信报表
//   centerApplication: '申报中心', // 企业微信报表
// }

let setCountDown
function countDown () {
  clearTimeout(setCountDown)
  setCountDown = setTimeout(() => {
    console.log('完成文件复制')
    svn.add(toPath, (err, data) => {
      console.log('svn添加', err, data)
      svn.commit(toPath, { params: ['-m ' + projectName + '自动svn提交添加'] }, (err, data) => {
        console.log('svn提交添加', err, data)
      })
    })
  }, 3000)
}

// let alldir = []
// function rmdir (filePath, callback) {
//   // 先判断当前filePath的类型(文件还是文件夹,如果是文件直接删除, 如果是文件夹, 去取当前文件夹下的内容, 拿到每一个递归)
//   fs.stat(filePath, function (err, stat) {
//     if (err) return console.log(err)
//     if (stat.isFile()) {
//       fs.unlink(filePath, callback)
//     } else {
//       fs.readdir(filePath, function (err, data) {
//         if (err) return console.log(err)
//         let dirs = data.map(dir => Path.join(filePath, dir))
//         let index = 0
//         alldir = [...alldir, filePath, ...dirs]
//         console.log('alldir', alldir)
//         !(function next () {
//           // 此处递归删除掉所有子文件 后删除当前 文件夹
//           // console.log(index, dirs.length, filePath)
//           if (index === dirs.length) {
//             if (filePath !== toPath) fs.rmdir(filePath, callback)
//             else callback()
//           } else {
//             rmdir(dirs[index++], next)
//           }
//         })()
//       })
//     }
//   })
// }


/**
 * 复制一个文件夹下的文件到另一个文件夹
 * @param src 源文件夹
 * @param dst 目标文件夹
 */
function copyDir (src, dst) {
  // 读取目录中的所有文件/目录
  fs.readdir(src, function (err, paths) {
    if (err) {
      throw err
    }
    paths.forEach(function (path) {
      const _src = src + '/' + path
      const _dst = dst + '/' + path
      let readable; let writable
      fs.stat(_src, function (err, st) {
        if (err) {
          throw err
        }
        // 判断是否为文件
        if (st.isFile()) {
          // 创建读取流
          readable = fs.createReadStream(_src)
          // 创建写入流
          writable = fs.createWriteStream(_dst)
          // 通过管道来传输流
          readable.pipe(writable)
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
          exists(_src, _dst, copyDir)
        }
      })
    })
    countDown()
  })
}
/**
 * 在复制目录前需要判断该目录是否存在，
 * 不存在需要先创建目录
 * @param src
 * @param dst
 * @param callback
 */
function exists (src, dst, callback) {
  // 如果路径存在，则返回 true，否则返回 false。
  if (fs.existsSync(dst)) {
    callback(src, dst)
  } else {
    fs.mkdir(dst, function () {
      callback(src, dst)
    })
  }
}


// rmdir(toPath, function () {
//   console.log(toPath, '文件清理')
//   console.log(fromPath, '开始复制文件')

//   // exists(fromPath, toPath, copyDir)
// })

/**
 * 工作步骤：
 * 1.设置编译参数 run
 * 2.更新项目文件 update
 * 3.清理项目文件 del
 * 4.提交删除 commit
 * 5.复制文件 exists
 * 6.svn添加文件并提交 countDown
 *
 * 注意事项：
 * 1.没有监测文件复制进度，3秒后自动执行countDown，有机会引起问题
 */
function run (mode = 'test') {
  console.log('正在更新', mode, '环境文件')
  buildMode = mode
  toPath = buildRootDir + '\\' + buildMode + '\\' + projectName
  svn.update(toPath, (err, data) => {
    console.log('svn更新', err, data)
    svn.del(toPath, (err, data) => {
      console.log('svn删除', err, data)
      svn.commit(toPath, { params: ['-m "自动svn提交删除"'] }, (err, data) => {
        let fromPath = Path.resolve(buildPath)
        console.log('svn提交删除', err, data)
        console.log(fromPath, '开始复制文件')
        exists(fromPath, toPath, copyDir)
      })
    })
  })
}
module.exports = run

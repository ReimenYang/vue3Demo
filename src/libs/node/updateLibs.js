const Path = require('path')
const { projectName } = require('../../projectConfig.js')
let svnUltimate = require('node-svn-ultimate')
let svn = svnUltimate.commands
/**
 * 工作步骤：
 * 1.保存项目信息 setPorjectUrl
 * 2.检查提交状态 checkStatusUpdate
 * 3.更新项目文件 update
 * 4.检查更新后是否有冲突 checkStatusSwitch
 * 5.切换到仓库分支 switchToRepository
 * 6.将项目合并到仓库并检查冲突 checkStatusMerge mergeToRepository
 * 7.提交仓库更新 commitRepository
 * 8.切回到项目 switchToWorking
 * 9.将仓库合并到项目并检查冲突 mergeToRepository
 * 10.提交项目更新 commitWorking
 *
 * 注意事项：
 * 1.务必清楚当前操作分支是哪一个
 * 2.一旦发生冲突或终止，需要手动处理完两个分支的版本后再次运行
 * 3.提交喝更新不仅仅提交修改的文件，需要操作当前目录
 */
class Libs {
  constructor() {
    this.repository = ['svn://172.16.20.21/SourceCode/webDevelop/uniApp/libs']
    // this.repository = ['svn://172.16.20.21/SourceCode/questionnaire/public/libs']
    this.working = ''
    this.mergeFile = []
    this.conflictedFile = []
    this.modifiedFile = []
    this.step = 0
    this.stepList = [
      { label: '保存项目信息', name: 'setPorjectUrl', fun: this.setPorjectUrl.bind(this) },
      { label: '检查提交状态', name: 'checkStatusUpdate', fun: this.checkStatus.bind(this, 'update') },
      { label: '更新项目文件', name: 'update', fun: this.update.bind(this) },
      { label: '检查更新后是否有冲突', name: 'checkStatusSwitch', fun: this.checkStatus.bind(this, 'switch') },
      { label: '切换到仓库分支', name: 'switchToRepository', fun: this.switch.bind(this, 'repository') },
      { label: '合并分支前的检查', name: 'checkStatusMerge', fun: this.checkStatus.bind(this, 'merge') },
      { label: '将项目合并到仓库并检查冲突', name: 'mergeToRepository', fun: this.merge.bind(this, 'working') },
      { label: '提交仓库更新', name: 'commitRepository', fun: this.commit.bind(this, 'repository') },
      { label: '切回到项目', name: 'switchToWorking', fun: this.switch.bind(this, 'working') },
      { label: '将仓库合并到项目并检查冲突', name: 'mergeToWorking', fun: this.merge.bind(this, 'repository') },
      { label: '提交项目更新', name: 'commitWorking', fun: this.commit.bind(this, 'working') }
    ]
  }

  // 步进器
  stepByStep (err, data, errType = '执行失败') {
    if (this.step === this.stepList.length) {

      console.log('步骤完成', this.step, projectName)
      this.step = 0
      return
    }
    let _nowStep = this.stepList[this.step]
    console.log('正在处理', _nowStep.label)
    if (err) return console.log(_nowStep.label, errType, err)
    this.step++
    console.log('步骤', this.step)
    _nowStep.fun(data)
  }

  // 记录本地svn路径
  setPorjectUrl () {
    svn.info(Path.resolve('./'), (err, data) => {
      this.working = data.entry.url
      this.stepByStep(err, data)
    })
  }

  // 状态检查
  checkStatus (setp) {
    svn.status(Path.resolve('./'), (err, data) => {
      let targetList = data.target.entry

      // 没有文件要提交
      if (!targetList) return this.stepByStep(err, data)
      // 有未提交，targetList多文件时为数组,单文件时为对象
      if (!targetList.length) targetList = [targetList]

      if (err || (typeof targetList === 'object' && targetList.length === undefined)) return this.stepByStep(err, data)
      // targetList多文件时为数组,单文件时为对象
      if (!targetList.length) targetList = [targetList]

      if (!targetList) return this.stepByStep('已经是最新版本', data)
      if (err || (typeof targetList === 'object' && targetList.length === undefined)) return this.stepByStep(err, data)
      let conflictedList = targetList.filter(item => item['wc-status']['$'].item === 'conflicted')
      this.conflictedFile = conflictedList.map(item => item['$'].path)
      if (this.conflictedFile.length) {
        this.stepByStep(this.conflictedFile.length, '', '发现冲突：')
        this.stepByStep(this.conflictedFile, '', '冲突文件列表：')
        return
      }

      let modifiedList = targetList.filter(item => item['wc-status']['$'].item === 'modified')
      this.modifiedFile = modifiedList.map(item => item['$'].path)

      switch (setp) {
        case 'update':// 更新前的检查
          if (this.modifiedFile.length) return this.stepByStep(this.modifiedFile, '', '有文件未提交')
          break
        case 'switch':// 切换分支前的检查
          // if (targetList.length) return console.log('有文件未提交，终止合并', targetList.map(item => item['$'].path))
          break
        case 'merge':// 合并分支前的检查
          this.mergeFile = targetList
          break
        case 'commit':// 提交前的检查
          console.log('提交前的检查', this.modifiedFile)
          break
        default:
          console.log('未设置检查阶段')
          break
      }
    })
  }

  // 更新代码
  update () {
    svn.update(Path.resolve('./'), (err, data) => {
      this.stepByStep(err, data)
    })
  }

  // 切换分支
  switch (target) {
    console.log('当前分支地址', this[target])
    svn.switch(this[target], Path.resolve('./'), (err, data) => {
      this.stepByStep(err, data)
    })
  }

  // 合并分支
  merge (target) {
    svn.merge(this[target], (err, data) => {
      console.log('合并项目代码到模板', data)
      if (err) this.stepByStep(err, data)
      this.conflictedFile = data.match(/C {3}(.*)/img) || []
      if (this.conflictedFile.length) return this.stepByStep(this.conflictedFile, '', '合并引起冲突')
      this.stepByStep(err, data)
    })
  }

  // 提交版本
  commit () {
    svn.commit(this.modifiedFile, { params: ['-m "' + projectName + '自动同步libs"'] }, (err, data) => {
      this.stepByStep(err, data)
    })
  }
}
const test = new Libs()
test.stepByStep()


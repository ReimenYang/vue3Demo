let dbConfig = {}
let sqlite = {
  // #ifdef APP-PLUS
  // 数据库初始化
  init (config) {
    dbConfig = config
    console.log('数据库设置', dbConfig)
  },
  // 打开数据库
  async openDatabase () {
    return new Promise(resolve => {
      plus.sqlite.openDatabase({
        ...dbConfig,
        success (data) {
          console.log('数据库打开成功', dbConfig, data)
          resolve({ statusCode: 200, data })
        },
        fail (err) {
          console.log('数据库打开失败', dbConfig, JSON.stringify(err))
          resolve({ statusCode: 500, err })
        }
      })
    })
  },
  // 判断数据库是否打开
  isOpenDatabase () {
    console.log('数据库是否已经打开', dbConfig, plus.sqlite.isOpenDatabase(dbConfig))
    return plus.sqlite.isOpenDatabase(dbConfig)
  },
  // 关闭数据库
  closeDatabase () {
    return new Promise(resolve => {
      plus.sqlite.closeDatabase({
        ...dbConfig,
        success (data) {
          console.log('数据库关闭成功', dbConfig, data)
          resolve({ statusCode: 200, data })
        },
        fail (err) {
          console.log('数据库关闭失败', dbConfig, JSON.stringify(err))
          resolve({ statusCode: 500, err })
        }
      })
    })
  },
  // 执行SQL执行增删改等语句
  executeSql (sql) {
    return new Promise(resolve => {
      plus.sqlite.executeSql({
        ...dbConfig,
        sql,
        success () {
          console.log('增删改成功', sql)
          resolve({ statusCode: 200, data: sql })
        },
        fail (err) {
          console.log('增删改失败', sql, JSON.stringify(err))
          resolve({ statusCode: 500, err })
        }
      })
    })
  },
  // 查询SQL语句
  selectSql (sql) {
    return new Promise(resolve => {
      plus.sqlite.selectSql({
        ...dbConfig,
        sql,
        success (data) {
          console.log('查询成功', sql, data)
          data.forEach(item => console.log(item))
          resolve({ statusCode: 200, data: sql })
        },
        fail (err) {
          console.log('查询失败', sql, JSON.stringify(err))
          resolve({ statusCode: 500, err })
        }
      })
    })
  },
  // 执行事务 begin（开始事务） commit（提交） rollback（回滚）
  transaction (operation) {
    return new Promise(resolve => {
      plus.sqlite.transaction({
        ...dbConfig,
        operation,
        success (data) {
          console.log('事务成功', operation, data)
          resolve({ statusCode: 200, data })
        },
        fail (err) {
          console.log('事务失败', operation, JSON.stringify(err))
          resolve({ statusCode: 500, err })
        }
      })
    })
  }
  // #endif
}

export default sqlite

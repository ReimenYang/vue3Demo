const { projectName, port } = require('./src/projectConfig.js')
module.exports = {
  publicPath: '/' + projectName + '/',
  devServer: {
    disableHostCheck: true,
    port
  },
  configureWebpack: { // element-plus引入安装时会引入最新的版本（在安装时没有指定版本），在使用webpack版本时大概率会出现问题
    module: {
      rules: [
        {
          type: 'javascript/auto',
          test: /\.mjs$/,
          use: [],
        }
      ]
    }
  }
}
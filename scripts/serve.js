'use strict'

const chalk = require('chalk')
const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const createWebpackConfig = require('../webpack')

const Dashboard = require('webpack-dashboard')
const DashboardPlugin = require('webpack-dashboard/plugin')
const dashboard = new Dashboard()

module.exports = (bundleDir, template) => {
  process.env.NODE_ENV = 'development'
  const webpackConfig = createWebpackConfig(bundleDir, template)
  webpackConfig.plugins.push(new DashboardPlugin(dashboard.setData))
  const compiler = webpack(webpackConfig)
  new WebpackDevServer(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    historyApiFallback: true,
    noInfo: false,
    quiet: true,
    stats: {
      chunkModules: false,
      colors: true
    }
  }).listen(8000, 'localhost', function (err) {
    if (err) {
      console.log(chalk.red(err))
    }
    console.log(chalk.green('Listening at localhost:8000'))
  })
}

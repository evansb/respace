const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (webpackConfig, config) => {
  webpackConfig.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      },
      'NODE_ENV': process.env.NODE_ENV,
      __DEV__: config.isDevelopment
    })
  ]
  if (config.isDevelopment) {
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'template.html'),
        hash: false,
        filename: 'index.html',
        inject: 'body'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    )
  } else {
    webpackConfig.plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused: true,
          dead_code: true,
          warnings: false
        }
      })
    )
  }
}

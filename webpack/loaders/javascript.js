'use strict'

module.exports = (webpackConfig, config) => {
  webpackConfig.module.loaders.push(
    { test: /symbol-observable/, loader: 'babel' },
    { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel' },
    { test: /\.json$/, loader: 'json' }
  )
}

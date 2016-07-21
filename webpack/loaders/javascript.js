'use strict'

module.exports = (webpackConfig, config) => {
  webpackConfig.module.loaders.push(
    { test: /golden-layout/,
      loader: 'imports?$=jquery&jQuery=jquery&React=react&ReactDOM=react-dom' },
    { test: /(symbol-observable|react-icons)/, loader: 'babel' },
    { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel' },
    { test: /\.json$/, loader: 'json' }
  )
}

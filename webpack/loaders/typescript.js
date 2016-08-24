'use strict'

module.exports = (webpackConfig) => {
  const typescript = require.resolve('typescript')
  webpackConfig.module.loaders.push({
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    loader: `awesome-typescript-loader?typescript=${typescript}`
  })
}

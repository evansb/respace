'use strict'
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin

module.exports = (webpackConfig) => {
  const typescript = require.resolve('typescript')
  webpackConfig.plugins.push(new ForkCheckerPlugin())
  webpackConfig.module.loaders.push({
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    loader: `awesome-typescript-loader?typescript=${typescript}`
  })
}

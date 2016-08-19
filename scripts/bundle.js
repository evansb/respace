'use strict'

const chalk = require('chalk')
const bundleAnalyzer = require('webpack-bundle-size-analyzer')
const webpack = require('webpack')
const createWebpackConfig = require('../webpack')

const format = {
  chunks: false,
  chunkModules: false,
  colors: true
}

module.exports = (bundleDir) => {
  process.env.NODE_ENV = 'production'
  console.log(chalk.yellow(`Bundling ${bundleDir}`))
  const webpackConfig = createWebpackConfig(bundleDir)
  const compiler = webpack(webpackConfig)

  compiler.run((err, stats) => {
    const jsonStats = stats.toJson()
    console.log(stats.toString(format))

    if (err) {
      console.log(chalk.red('Webpack compiler encountered a fatal error.', err))
    } else if (jsonStats.errors.length > 0) {
      console.log(
        chalk.red('Webpack compiler encountered errors.'),
        chalk.red(jsonStats.errors.join('\n'))
      )
    } else if (jsonStats.warnings.length > 0) {
      console.log(
        chalk.yellow('Webpack compiler encountered warnings.'),
        chalk.yellow(jsonStats.warnings.join('\n'))
      )
    } else {
      console.log(chalk.green('All good.'))
    }
    const depTree = bundleAnalyzer.dependencySizeTree(jsonStats)
    depTree.forEach(tree => {
      bundleAnalyzer.printDependencySizeTree(tree)
    })
  })
}

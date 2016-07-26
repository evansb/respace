'use strict'

const path = require('path')
const configurePlugins = require('./configurePlugins')
const configureLoaders = require('./configureLoaders')
const createConfig = require('./createConfig')

module.exports = (bundleDir) => {
  const config = createConfig(bundleDir)
  const projectDir = path.resolve(__dirname, '..')
  const webpackConfig = {
    context: projectDir,
    name: 'respace',
    resolve: {
      alias: {},
      root: config.base,
      packageMains: ['respace:main', 'webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main', 'jsnext:main'],
      extensions: ['', '.js', '.jsx', '.jsx', '.ts', '.tsx', '.json']
    },
    module: {}
  }

  const base = path.join(projectDir, 'packages', 'common', 'node_modules')
  const commonDeps = [
    'react',
    'react-dom',
    'react-bootstrap',
    'mobx',
    'mobx-react'
  ]
  commonDeps.forEach((dep) => {
    webpackConfig.resolve.alias[dep] = path.join(base, dep)
  })

  const baseEntry = config.isDevelopment
      ? [ 'webpack-dev-server/client?http://localhost:8000',
          'webpack/hot/only-dev-server' ]
      : []

  webpackConfig.debug = true
  webpackConfig.entry = {
    [config.name]: baseEntry.concat([
      'babel-polyfill',
      path.join(config.base, config.pkg['respace:main'] || config.pkg['main'])
    ])
  }

  if (config.isDevelopment) {
    webpackConfig.devtool = 'eval'
  }

  webpackConfig.output = {
    filename: `${config.name}.min.js`,
    path: config.dist,
    publicPath: '/'
  }

  configurePlugins(webpackConfig, config)
  configureLoaders(webpackConfig, config)

  return webpackConfig
}

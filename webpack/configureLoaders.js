'use strict'

const configureJSLoader = require('./loaders/javascript')
const configureTSLoader = require('./loaders/typescript')
const configureFileLoader = require('./loaders/file')
const configureStyleLoader = require('./loaders/style')

module.exports = (webpackConfig, config) => {
  webpackConfig.module.loaders = []
  configureTSLoader(webpackConfig, config)
  configureJSLoader(webpackConfig, config)
  configureFileLoader(webpackConfig, config)
  configureStyleLoader(webpackConfig, config)
}

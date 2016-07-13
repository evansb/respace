'use strict'

const cssnano = require('cssnano')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (webpackConfig, config) => {
  if (!config.isDevelopment) {
    webpackConfig.postcss = [
      cssnano({
        autoprefixer: {
          add: true,
          remove: true,
          browsers: ['last 2 versions']
        },
        discardComments: {
          removeAll: true
        },
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        safe: true
      })
    ]
  }
  webpackConfig.module.loaders.push({
    test: /\.scss$/,
    loaders: [
      'style',
      'css',
      'postcss',
      'sass'
    ]
  })
  webpackConfig.module.loaders.push({
    test: /\.css$/,
    loaders: [
      'style',
      'css',
      'postcss'
    ]
  })

  if (!config.isDevelopment) {
    webpackConfig.module.loaders.filter((loader) =>
      loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
    ).forEach((loader) => {
      const first = loader.loaders[0]
      const rest = loader.loaders.slice(1)
      loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
      delete loader['loaders']
    })
    webpackConfig.plugins.push(
      new ExtractTextPlugin('[name].css', {
        allChunks: true
      })
    )
  }
}

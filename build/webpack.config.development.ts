/// <reference path='webpack.fix.d.ts' />

import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as path from 'path'
import * as webpack from 'webpack'

import { CheckerPlugin } from 'awesome-typescript-loader'
import baseConfig from './webpack.config.base'

const merge = require('webpack-merge') // tslint:disable-line

const port = process.env.PORT || 8000

const publicPath = `http://localhost:${port}/`

const hot = 'webpack-hot-middleware/client?path=' +
  publicPath + '__webpack_hmr'

const entryPoint = process.env.EXAMPLE || 'demo'

const config: webpack.Configuration = {
  devtool: 'inline-source-map',

  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      hot,
      path.resolve(__dirname, '../examples', entryPoint, 'index.ts')
    ],
    blueprintjs: [
      './src/blueprintjs'
    ]
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: ['node_modules'],
        test: /\.js$/,
        use: ['source-map-loader']
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          'sass-loader'
        ]
      }
     ]
  },

  output: {
    publicPath
  },

  plugins: [
    new CheckerPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(false),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: path.resolve(__dirname, '../index.html')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ]
}

export default merge(baseConfig, config)

/// <reference path='webpack.fix.d.ts' />

import * as ExtractTextPlugin from 'extract-text-webpack-plugin'
import * as path from 'path'
import * as webpack from 'webpack'
import * as ParallelUglifyPlugin from 'webpack-parallel-uglify-plugin'

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import baseConfig from './webpack.config.base'

const merge = require('webpack-merge') // tslint:disable-line

export default merge(baseConfig, {
  devtool: 'cheap-module-source-map',

  entry: ['babel-polyfill', './src/index'],

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
     ]
  },

  output: {
    filename: 'respace.bundle.js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/'
  },

  plugins: [
    new BundleAnalyzerPlugin(),
    new ParallelUglifyPlugin({
      cacheDir: path.resolve(__dirname, '../.uglifycache')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(false),
    new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
})

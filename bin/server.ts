/// <reference path='server.d.ts' />
import * as _debug from 'debug'
import * as express from 'express'
import * as path from 'path'
import * as webpack from 'webpack'
import * as webpackDevMiddleware from 'webpack-dev-middleware'
import * as webpackHotMiddleware from 'webpack-hot-middleware'

import { spawn } from 'child_process'

import config from '../build/webpack.config.development'

const port = process.env.PORT || 8000
const app = express()
const debug = _debug('respace')
let compiler

try {
  compiler = webpack(config)
} catch (e) {
  console.error(e)
}

const wdm = webpackDevMiddleware(compiler, {
  contentBase: path.resolve(__dirname, '..'),
  hot: true,
  lazy: false,
  publicPath: config.output.publicPath,
  quiet: true,
  stats: {
    colors: true
  }
})

app.use(wdm)
app.use(webpackHotMiddleware(compiler, {
  path: '/__webpack_hmr'
}))

const server = app.listen(port, 'localhost', (error: Error) => {
  if (error) {
    return console.error(error)
  }
  debug(`Listening at http://localhost:${port}`)
})

app.use(express.static(path.resolve(__dirname, '../dist')))

process.on('SIGTERM', () => {
  debug('Stopping dev server')
  wdm.close()
  server.close(() => {
    process.exit(0)
  })
})

'use strict'

const path = require('path')

module.exports = (bundleDir, template) => {
  const __DEV__ = process.env.NODE_ENV === 'development'
  const name = path.basename(bundleDir)
  const base = path.join(process.cwd(), bundleDir)
  const dist = path.join(base, 'dist')
  const pkg = require(path.join(base, 'package.json'))
  return { name, base, dist, template, isDevelopment: __DEV__, pkg }
}

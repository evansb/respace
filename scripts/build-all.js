'use strict'

const path = require('path')
const fs = require('fs')
const buildComponent = require('./build')
const junk = require('junk')

module.exports = () => {
  const packages = fs.readdirSync(path.join(process.cwd(), 'packages'))
    .filter(junk.not)
    .filter((p) => !/respace-preset/.test(p))
  packages.forEach((pack) => {
    if (/respace-theme/.test(pack)) {
      console.log(`Building theme ${pack}`)
    } else {
      console.log(`Building component ${pack}`)
      buildComponent(pack)
    }
  })
}

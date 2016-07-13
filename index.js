#!/usr/bin/env node --harmony
'use strict'

const program = require('commander')
const bundle = require('./scripts/bundle')
const serve = require('./scripts/serve')
const buildComponent = require('./scripts/build')
const buildAll = require('./scripts/build-all')

program
  .usage('(bundle|serve|build) [dir]')
  .arguments('<cmd> [dir]')
  .version(require('./package.json').version)
  .action((cmd, presetDir) => {
    if (cmd === 'build-all') {
      buildAll()
    } else {
      if (!presetDir) {
        console.error(cmd + ' requires package directory as additional argument')
        program.outputHelp()
        process.exit(1)
      }
      if (cmd === 'bundle') {
        bundle(presetDir)
      } else if (cmd === 'serve') {
        serve(presetDir)
      } else if (cmd === 'build') {
        buildComponent(presetDir)
      } else {
        program.outputHelp()
      }
    }
  })

program.parse(process.argv)

'use strict'

const path = require('path')
const gulp = require('gulp')
const debug = require('gulp-debug')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const sourcemap = require('gulp-sourcemaps')
const gulpIgnore = require('gulp-ignore')
const merge = require('merge2')

module.exports = (componentName) => {
  process.env.NODE_ENV = 'production'
  const base = path.join(process.cwd(), 'packages', componentName)
  const pkg = require(path.join(base, 'package.json'))
  const tsInDir = path.join(base, path.dirname(pkg['respace:main']))
  const mainFile = path.join(base, pkg['respace:main'])

  if (mainFile && (mainFile.endsWith('.ts') || mainFile.endsWith('.tsx'))) {
    const taskName = componentName + ':build'

    const tsConfig = path.join(process.cwd(), 'tsconfig.json')

    const tsProject = ts.createProject(tsConfig, {
      declaration: true,
      typescript: require('typescript')
    })

    gulp.task(taskName, () => {
      const tsResult = gulp.src(tsInDir + '/**/*.ts*')
        .pipe(sourcemap.init())
        .pipe(ts(tsProject))
      const source = tsResult.js.pipe(gulp.dest(path.join(base, 'es6')))
        .pipe(sourcemap.write('.'))
        .pipe(debug({ title: `${componentName}:es6` }))
        .pipe(gulpIgnore.exclude('*.map'))
        .pipe(gulp.dest(path.join(base, 'es6')))
        .pipe(babel())
        .pipe(gulp.dest(path.join(base, 'es5')))
        .pipe(sourcemap.write('.'))
        .pipe(debug({ title: `${componentName}:es5` }))
      const typings = tsResult.dts
        .pipe(debug({ title: `${componentName}:typings` }))
        .pipe(gulp.dest(path.join(base, 'definitions')))

      return merge([source, typings])
    })

    gulp.start(taskName)
  }
}

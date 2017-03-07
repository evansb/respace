
import * as _debug from 'debug'
import * as webpack from 'webpack'

import config from '../build/webpack.config.production'

const debug = _debug('respace')

webpack(config).run((error, stats) => {
  if (error) {
    debug('Webpack encountered fatal error', error)
  }

  const jsonStats = stats.toJson()
  debug('Webpack compile completed')
  debug(stats.toString({
    chunkModules : false,
    chunks : true,
    colors : true
  }))

  if (jsonStats.errors.length > 0) {
    debug('Webpack compiler encountered errors.')
    debug(jsonStats.errors.join('\n'))
    process.exit(1)
  } else if (jsonStats.warnings.length > 0) {
    debug('Webpack compiler encountered warnings.')
    debug(jsonStats.warnings.join('\n'))
  } else {
    debug('No errors or warnings encountered.')
  }
})

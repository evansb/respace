import respace from 'respace-core'

let container
if (container = document.getElementById('root')) {
  respace.render(container)
}

if (__DEV__ && module.hot) {
  module.hot.accept('respace-core', () => {
    const respace = require('respace-core').default
    respace.render(container)
  })
}

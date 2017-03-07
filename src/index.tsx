/// <reference path='./hmr.fix.d.ts' />
import * as React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import {App} from './containers/App'

import './styles/app.scss'

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default
    render(
      <AppContainer>
        <App />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}

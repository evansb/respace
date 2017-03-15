/// <reference path='./hmr.fix.d.ts' />
import * as React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { App } from './containers/App'

import './styles/containers/app.scss'

const container = document.getElementById('root') || document.body

const renderApp = (App: any) => {
  render(
    <AppContainer>
      <App />
    </AppContainer>,
    container
  )
}

renderApp(App)

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default
    renderApp(NextApp)
  })
}

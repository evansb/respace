/// <reference path='./hmr.fix.d.ts' />
import * as React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import App from './containers/App'
import createStore from './store/createStore'

import './styles/containers/app.scss'

const container = document.getElementById('root') || document.body
const store = createStore()

const renderApp = (App: any) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
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

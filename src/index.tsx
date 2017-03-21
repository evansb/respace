/// <reference path='./hmr.fix.d.ts' />
import * as React from 'react'
import { render } from 'react-dom'
import initReactFastClick from 'react-fastclick'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { Store } from 'redux'

import App from './containers/App'
import { IInitializer } from './initializer'
export { IInitializer }
import createStore from './store/createStore'
import './styles/containers/app.scss'

initReactFastClick()

let __RESPACE_STORE__: Store<any>
let __RESPACE_CONTAINER__: HTMLElement

const renderApp = (App: any) => {
  render(
    <AppContainer>
      <Provider store={__RESPACE_STORE__}>
        <App />
      </Provider>
    </AppContainer>,
    __RESPACE_CONTAINER__
  )
}

export const createAndRender = (container: HTMLElement,
  initializer: IInitializer) => {

  const store = createStore(initializer)

  __RESPACE_STORE__ = store
  __RESPACE_CONTAINER__ = container

  renderApp(App)
}

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default
    renderApp(NextApp)
  })
}

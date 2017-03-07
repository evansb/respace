/// <reference path='./hmr.fix.d.ts' />
import * as React from 'react'
import {render} from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import {hashHistory, IndexRoute, Route, Router} from 'react-router'
import {App} from './containers/App'

import {AdminRoot} from './components/admin/AdminRoot'
import {UserAdmin} from './components/admin/UserAdmin'

import './styles/containers/app.scss'

render(
  <AppContainer>
    <Router history={hashHistory}>
      <Route component={App}>
        <Route path="/admin" component={AdminRoot}>
           <IndexRoute component={UserAdmin}></IndexRoute>
        </Route>
      </Route>
    </Router>
  </AppContainer>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default
    render(
      <AppContainer>
        <Router history={hashHistory}>
          <Route component={App}>
            <Route path="/admin" component={AdminRoot}>
              <IndexRoute component={UserAdmin}></IndexRoute>
            </Route>
          </Route>
        </Router>
      </AppContainer>,
      document.getElementById('root')
    )
  })
}

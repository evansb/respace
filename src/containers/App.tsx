/**
 * Main Container
 */
import * as React from 'react'

import {Content} from './Content'
import {Sidebar} from './Sidebar'
import {Sidenav} from './Sidenav'

export class App extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-app" className="row">
        <div id="rs-sidenav" className="col-narrow">
          <Sidenav />
        </div>
        <div id="rs-sidebar" className="col-xs-5 col-sm-5 col-md-4 col-lg-3">
          <Sidebar />
        </div>
        <div id="rs-content" className="col-xs">
          <Content />
        </div>
      </div>
    )
  }
}

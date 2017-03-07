/**
 * Main Container
 */
import * as React from 'react'

import {Sidebar} from './Sidebar'
import {Sidenav} from './Sidenav'

export class App extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-app" className="row">
        <div id="rs-sidenav" className="col-narrow">
          <Sidenav />
        </div>
        <div className="col-xs">
          {this.props.children}
        </div>
      </div>
    )
  }
}

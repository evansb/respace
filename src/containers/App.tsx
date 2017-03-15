import * as React from 'react'

import { Content } from './Content'
import { Sidebar } from './Sidebar'

export class App extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-app" className="row">
        <div id="rs-sidebar" className="col-xs-2 col-lg-3">
          <Sidebar />
        </div>
        <div className="col-xs">
          <Content />
        </div>
      </div>
    )
  }
}

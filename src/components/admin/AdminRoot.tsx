import * as React from 'react'

import {Content} from '../../containers/Content'
import {Sidebar} from '../../containers/Sidebar'

export class AdminRoot extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-root" className="row">
        <Sidebar><h4>Admin Sidebar</h4></Sidebar>
        <Content>{this.props.children}</Content>
      </div>
    )
  }
}
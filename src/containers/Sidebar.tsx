/**
 * Sidebar
 */
import * as React from 'react'

export class Sidebar extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-sidebar" className="col-xs-4 col-md-3 col-lg-2">
        <h2>Sidebar</h2>
        {this.props.children}
      </div>
    )
  }
}

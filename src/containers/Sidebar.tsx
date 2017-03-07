/**
 * Sidebar
 */
import * as React from 'react'

export class Sidebar extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-sidebar" className="col-sidebar">
        <h2>Sidebar</h2>
        {this.props.children}
      </div>
    )
  }
}

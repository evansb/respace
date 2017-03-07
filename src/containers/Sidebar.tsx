/**
 * Sidebar
 */
import * as React from 'react'
import {UserStatus} from '../components/UserStatus'

export class Sidebar extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-sidebar" className="col-sidebar">
        <UserStatus />
        {this.props.children}
      </div>
    )
  }
}

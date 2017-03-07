/**
 * Content
 */
import * as React from 'react'
import {Navbar} from '../components/Navbar'

export class Content extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-content" className="col-xs">
        <Navbar></Navbar>
        {this.props.children}
      </div>
    )
  }
}

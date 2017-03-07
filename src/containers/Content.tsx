/**
 * Content
 */
import * as React from 'react'

export class Content extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-content" className="col-xs">
        {this.props.children}
      </div>
    )
  }
}

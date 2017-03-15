import * as React from 'react'

import { Content } from './Content'
import { Sidebar } from './Sidebar'

export class App extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-app">
        <Sidebar />
        <Content />
      </div>
    )
  }
}

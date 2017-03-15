import * as React from 'react'

import { Content } from './Content'
import { Sidebar } from './Sidebar'

import { Navbar } from '../components/Navbar'

export class App extends React.Component<void, void> {
  render() {
    return (
      <div id="rs-app">
        <Navbar />
        <div className='row'>
          <Sidebar />
          <Content />
        </div>
      </div>
    )
  }
}

import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Content } from './Content'
import { Sidebar } from './Sidebar'

import { toggleSidebar } from '../actions/creators'
import { Navbar } from '../components/Navbar'
import { State } from '../store/shape'

export interface IAppProps {
  sidebarToggled: boolean
  toggleSidebar: () => void
}

class App extends React.Component<any, any> {
  render() {
    return (
      <div id="rs-app">
        <Navbar
          isSidebarToggled={this.props.sidebarToggled}
          toggleSidebar={this.props.toggleSidebar} />
        <div className='row pt-dark'>
          <Sidebar />
          <Content />
        </div>
      </div>
    )
  }
}

export default connect(
  (state: State) => ({
    sidebarToggled: state.app.sidebarToggled
  }),

  (dispatch: Dispatch<State>) => ({
    toggleSidebar: () => {
      dispatch(toggleSidebar())
    }
  })
)(App)

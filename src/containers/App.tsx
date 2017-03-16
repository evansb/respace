import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Content } from './Content'
import { Sidebar } from './Sidebar'

import {
  toggleDarkMode,
  toggleSettingsDialogOpen,
  toggleSidebar
} from '../actions/creators'
import { Navbar } from '../components/Navbar'
import { State } from '../store/shape'

export interface IAppProps {
  sidebarToggled: boolean
  darkMode: boolean
  settingsDialogOpen: boolean

  toggleSettingsDialogOpen: () => void
  toggleDarkMode: () => void
  toggleSidebar: () => void
}

class App extends React.Component<IAppProps, any> {
  render() {
    return (
      <div id="rs-app">
        <Navbar
          isDarkMode={this.props.darkMode}
          isSidebarToggled={this.props.sidebarToggled}
          toggleSidebar={this.props.toggleSidebar} />
        <div className='row'>
          { this.props.sidebarToggled &&
            <Sidebar
              isDarkMode={this.props.darkMode}
              isSettingsDialogOpen={this.props.settingsDialogOpen}
              toggleSettingsDialogOpen={this.props.toggleSettingsDialogOpen}
              toggleDarkMode={this.props.toggleDarkMode} /> }
          <Content
              isDarkMode={this.props.darkMode}
           />
        </div>
      </div>
    )
  }
}

export default connect(
  (state: State) => ({
    darkMode: state.app.darkMode,
    settingsDialogOpen: state.app.settingsDialogOpen,
    sidebarToggled: state.app.sidebarToggled
  }),

  (dispatch: Dispatch<State>) => ({
    toggleDarkMode: () => {
      dispatch(toggleDarkMode())
    },
    toggleSettingsDialogOpen: () => {
      dispatch(toggleSettingsDialogOpen())
    },
    toggleSidebar: () => {
      dispatch(toggleSidebar())
    },
  })
)(App)

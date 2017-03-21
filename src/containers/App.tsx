import { List } from 'immutable'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Content } from './Content'
import { Sidebar } from './Sidebar'

import {
  fetchTasks,
  setActiveResource,
  toggleDarkMode,
  toggleSettingsDialogOpen,
  toggleSidebar
} from '../actions/creators'

import { Navbar } from '../components/Navbar'
import { State } from '../store/shape'
import { ITask } from '../types'

export interface IAppProps {
  activeResource: ('briefing' | 'task')
  activeResourceId: number
  sidebarToggled: boolean
  darkMode: boolean
  settingsDialogOpen: boolean
  tasks: List<ITask>

  toggleSettingsDialogOpen: () => void
  toggleDarkMode: () => void
  toggleSidebar: () => void
  setActiveResource: (resource: ('briefing' | 'task'), id: number) => void

  fetchTasks: () => void
}

class App extends React.Component<IAppProps, any> {

  componentDidMount() {
    this.props.fetchTasks()
  }

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
              activeResource={this.props.activeResource}
              activeResourceId={this.props.activeResourceId}
              tasks={this.props.tasks}
              isDarkMode={this.props.darkMode}
              isSettingsDialogOpen={this.props.settingsDialogOpen}
              setActiveResource={this.props.setActiveResource}
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
    activeResource: state.app.activeResource,
    activeResourceId: state.app.activeResourceId,
    darkMode: state.app.darkMode,
    settingsDialogOpen: state.app.settingsDialogOpen,
    sidebarToggled: state.app.sidebarToggled,
    tasks: state.tasks
  }),

  (dispatch: Dispatch<State>) => ({
    fetchTasks: () => {
      dispatch(fetchTasks())
    },
    setActiveResource: (resource: ('briefing' | 'task'), id: number) => {
      dispatch(setActiveResource(resource, id))
    },
    toggleDarkMode: () => {
      dispatch(toggleDarkMode())
    },
    toggleSettingsDialogOpen: () => {
      dispatch(toggleSettingsDialogOpen())
    },
    toggleSidebar: () => {
      dispatch(toggleSidebar())
    }
  })
)(App)

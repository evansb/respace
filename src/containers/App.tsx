import { List } from 'immutable'
import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Content } from './Content'
import { Sidebar } from './Sidebar'

import {
  fetchTasks,
  setActiveResource,
  setActiveWidget,
  toggleDarkMode,
  toggleSettingsDialogOpen,
  toggleSidebar
} from '../actions/creators'

import { Briefing } from '../components/Briefing'
import { Navbar } from '../components/Navbar'
import { Task } from '../components/Task'
import { State } from '../store/shape'
import { ITask } from '../types'

export interface IAppProps {
  activeResource: ('briefing' | 'task')
  activeResourceId: number
  activeWidget: ('comments' | 'none' | 'interpreter')
  sidebarToggled: boolean
  darkMode: boolean
  settingsDialogOpen: boolean
  tasks: List<ITask>

  toggleSettingsDialogOpen: () => void
  toggleDarkMode: () => void
  toggleSidebar: () => void
  setActiveResource: (resource: ('briefing' | 'task'), id: number) => void
  setActiveWidget: (widget: ('comments' | 'none' | 'interpreter')) => void

  fetchTasks: () => void
}

class App extends React.Component<IAppProps, any> {

  componentDidMount() {
    this.props.fetchTasks()
  }

  get content() {
    switch (this.props.activeResource) {
      case 'briefing':
        return <Briefing />
      case 'task':
        const task = this.props.tasks.find((t: ITask) =>
          t.id === this.props.activeResourceId
        )
        if (task) {
          return <Task title={task.title} description={task.description} />
        } else {
          return null
        }
      default:
        return null
    }
  }

  render() {
    return (
      <div id="rs-app">
        <Navbar
          activeWidget={this.props.activeWidget}
          isDarkMode={this.props.darkMode}
          isSidebarToggled={this.props.sidebarToggled}
          toggleSidebar={this.props.toggleSidebar}
          setActiveWidget={this.props.setActiveWidget} />
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
          <div className='col-xs'>
            <Content
                activeWidget={this.props.activeWidget}
                setActiveWidget={this.props.setActiveWidget}
                isDarkMode={this.props.darkMode}>
              { this.content }
            </Content>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state: State) => ({
    activeResource: state.app.activeResource,
    activeResourceId: state.app.activeResourceId,
    activeWidget: state.app.activeWidget,
    darkMode: state.app.darkMode,
    settingsDialogOpen: state.app.settingsDialogOpen,
    sidebarToggled: state.app.sidebarToggled,
    tasks: state.tasks
  }),

  (dispatch: Dispatch<State>) =>
    bindActionCreators({
      fetchTasks,
      setActiveResource,
      setActiveWidget,
      toggleDarkMode,
      toggleSettingsDialogOpen,
      toggleSidebar
    }, dispatch)
)(App as any)

import * as React from 'react'

import { mount, shallow } from 'enzyme'
import { List } from 'immutable'
import { Task } from '../../reducers/taskReducer'
import { Sidebar } from '../Sidebar'

describe('Sidebar', () => {
  const props = {
    activeResource: 'briefing',
    activeResourceId: 0,
    darkMode: false,
    setActiveResource: jest.fn(),
    settingsDialogOpen: false,
    tasks: List([
      new Task({
        description: 'Test task description',
        fragment: 0,
        guided: true,
        id: 0,
        title: 'Test Task'
      }),
      new Task({
        description: 'Test task 2 description',
        fragment: 4,
        guided: true,
        id: 1,
        title: 'Test Task 2'
      })
    ]),
    toggleDarkMode: jest.fn(),
    toggleSettingsDialogOpen: jest.fn(),
  }

  it('renders with correct id', () => {
    const sidebar = shallow(<Sidebar {...props} ></Sidebar>)
    expect(sidebar.props().id).toBe('rs-sidebar')
  })

  it('applies pt-dark on dark mode', () => {
    const darkMode = Object.assign({}, props, { darkMode: true })
    const sidebar = shallow(<Sidebar {...darkMode} ></Sidebar>)
    expect(sidebar.hasClass('pt-dark')).toBe(true)
  })

  it('open settings dialog on click', () => {
    const sidebar = shallow(<Sidebar {...props} ></Sidebar>)
    sidebar.find('#rs-open-settings-dialog').simulate('click')
    expect(props.toggleSettingsDialogOpen.mock.calls.length).toBe(1)
  })

  it('set active resource on tree node click', () => {
    const sidebar = mount(<Sidebar {...props} ></Sidebar>)
    sidebar.find('li.pt-tree-node > div').last().simulate('click')
    expect(props.setActiveResource).toHaveBeenCalledWith('task', 1)
    sidebar.find('li.pt-tree-node > div').first().simulate('click')
    expect(props.setActiveResource).toHaveBeenCalledWith('briefing', 0)
  })
})

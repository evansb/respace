import * as React from 'react'

import { shallow } from 'enzyme'
import { Sidebar } from '../Sidebar'

describe('Sidebar', () => {
  const props = {
    isDarkMode: false,
    isSettingsDialogOpen: false,
    toggleDarkMode: jest.fn(),
    toggleSettingsDialogOpen: jest.fn()
  }

  it('renders with correct id', () => {
    const sidebar = shallow(<Sidebar {...props} ></Sidebar>)
    expect(sidebar.props().id).toBe('rs-sidebar')
  })

  it('applies pt-dark on dark mode', () => {
    const darkMode = Object.assign({}, props, {
      isDarkMode: true
    })
    const sidebar = shallow(<Sidebar {...darkMode} ></Sidebar>)
    expect(sidebar.hasClass('pt-dark')).toBe(true)
  })

  it('open settings dialog on click', () => {
    const sidebar = shallow(<Sidebar {...props} ></Sidebar>)
    sidebar.find('#rs-open-settings-dialog').simulate('click')
    expect(props.toggleSettingsDialogOpen.mock.calls.length).toBe(1)
  })
})

import * as React from 'react'

import { Button } from '@blueprintjs/core'
import { mount, shallow } from 'enzyme'
import { INavbarProps, Navbar } from '../Navbar'

describe('Navbar', () => {
  const toggleSidebar = jest.fn()
  const mockProps: INavbarProps = {
    isSidebarToggled: true,
    toggleSidebar
  }

  it('renders the correct id', () => {
    const navbar = shallow(<Navbar {...mockProps} />)
    expect(navbar.props().id).toBe('rs-navbar')
  })

  it('renders the sidebar toggle button and submit button', () => {
    const navbar = shallow(<Navbar {...mockProps} />)
    expect(navbar.find('#rs-submit').length).toBe(1)
    expect(navbar.find('#rs-toggle-sidebar').length).toBe(1)
  })

  it('calls toggle sidebar when clicked', () => {
    const navbar1 = shallow(<Navbar {...mockProps} />)
    navbar1.find('#rs-toggle-sidebar').simulate('click')
    expect(toggleSidebar.mock.calls.length).toBe(1)
  })

  it('renders the sidebar toggle button as active/inactive', () => {
    const navbar1 = mount(<Navbar {...mockProps} />)
    expect(navbar1.find('#rs-toggle-sidebar')
      .hasClass('pt-icon-one-column')).toBe(true)

    const mockProps2 = Object.assign({}, mockProps, {
      isSidebarToggled: false
    })
    const navbar2 = mount(<Navbar {...mockProps2} />)
    expect(navbar2.find('#rs-toggle-sidebar')
      .hasClass('pt-icon-two-columns')).toBe(true)
  })
})

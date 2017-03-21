import * as React from 'react'

import { Button } from '@blueprintjs/core'
import { mount, shallow } from 'enzyme'
import { INavbarProps, Navbar } from '../Navbar'

describe('Navbar', () => {
  const toggleSidebar = jest.fn()
  const setActiveWidget = jest.fn()
  const mockProps: INavbarProps = {
    activeWidget: 'none',
    darkMode: false,
    sidebarToggled: true,
    setActiveWidget,
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
      .hasClass('pt-intent-primary')).toBe(true)

    const mockProps2 = Object.assign({}, mockProps, { sidebarToggled: false })
    const navbar2 = mount(<Navbar {...mockProps2} />)
    expect(navbar2.find('#rs-toggle-sidebar')
      .hasClass('pt-intent-primary')).toBe(false)
  })

  it('applies pt-dark on dark mode', () => {
    const darkMode = Object.assign({}, mockProps, { darkMode: true })
    const navbar = shallow(<Navbar {...darkMode} />)
    expect(navbar.hasClass('pt-dark')).toBe(true)
  })

  it('renders the comments and interpreter toggle', () => {
    const navbar = mount(<Navbar {...mockProps} />)
    expect(navbar.find('#rs-toggle-comments').length).toBe(1)
    expect(navbar.find('#rs-toggle-interpreter').length).toBe(1)
  })

  it('calls setActiveWidget on click', () => {
    const navbar = mount(<Navbar {...mockProps} />)
    navbar.find('#rs-toggle-comments').simulate('click')
    navbar.find('#rs-toggle-interpreter').simulate('click')
    expect(setActiveWidget.mock.calls.length).toBe(2)
  })
})

import * as React from 'react'

import { Button } from '@blueprintjs/core'
import { shallow } from 'enzyme'
import { Navbar } from '../Navbar'

describe('Navbar', () => {
  it('renders the correct id', () => {
    const app = shallow(<Navbar />)
    expect(app.props().id).toBe('rs-navbar')
  })

  it('renders the sidebar toggle button and submit button', () => {
    const app = shallow(<Navbar />)
    expect(app.find('#rs-submit').length).toBe(1)
    expect(app.find('#rs-toggle-sidebar').length).toBe(1)
  })
})

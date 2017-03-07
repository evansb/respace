import * as React from 'react'

import { shallow } from 'enzyme'
import { Sidebar } from '../Sidebar'

describe('Sidebar container', () => {
  it('renders with correct id', () => {
    const app = shallow(<Sidebar></Sidebar>)
    expect(app.props().id).toBe('rs-sidebar')
  })
})

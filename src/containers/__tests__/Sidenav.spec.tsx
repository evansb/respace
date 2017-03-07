import * as React from 'react'

import { shallow } from 'enzyme'
import { Sidenav } from '../Sidenav'

describe('Sidenav container', () => {
  it('renders with correct id', () => {
    const app = shallow(<Sidenav></Sidenav>)
    expect(app.props().id).toBe('rs-sidenav')
  })
})

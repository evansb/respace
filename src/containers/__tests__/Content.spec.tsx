import * as React from 'react'

import { shallow } from 'enzyme'
import { Content } from '../Content'

describe('Content container', () => {
  it('renders with correct id', () => {
    const app = shallow(<Content></Content>)
    expect(app.props().id).toBe('rs-content')
  })
})

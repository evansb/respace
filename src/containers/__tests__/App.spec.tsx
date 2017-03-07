import * as React from 'react'

import { shallow } from 'enzyme'
import { App } from '../App'

describe('App container', () => {
  it('renders with correct id', () => {
    const app = shallow(<App></App>)
    expect(app.props().id).toBe('respace-app')
  })
})

import * as React from 'react'

import { shallow } from 'enzyme'
import { App } from '../App'
import { Sidebar } from '../Sidebar'

describe('App container', () => {
  it('renders with correct id', () => {
    const app = shallow(<App></App>)
    expect(app.props().id).toBe('rs-app')
  })

  it('renders sidebar and main content', () => {
    const app = shallow(<App></App>)
    expect(app.children().length).toBe(2)
    expect(app.find(Sidebar)).toHaveLength(1)
  })
})

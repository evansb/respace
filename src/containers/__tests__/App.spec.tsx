import * as React from 'react'

import { shallow } from 'enzyme'
import { App } from '../App'
import { Sidenav } from '../Sidenav'

describe('App container', () => {
  it('renders with correct id', () => {
    const app = shallow(<App></App>)
    expect(app.props().id).toBe('rs-app')
  })

  it('renders sidenav and some content', () => {
    const app = shallow(<App></App>)
    expect(app.children().length).toBe(2)
    expect(app.find(Sidenav)).toHaveLength(1)
  })
})

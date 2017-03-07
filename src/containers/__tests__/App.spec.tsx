import * as React from 'react'

import { shallow } from 'enzyme'
import { App } from '../App'
import { Content } from '../Content'
import { Sidebar } from '../Sidebar'
import { Sidenav } from '../Sidenav'

describe('App container', () => {
  it('renders with correct id', () => {
    const app = shallow(<App></App>)
    expect(app.props().id).toBe('rs-app')
  })

  it('renders sidenav, sidebar, and content', () => {
    const app = shallow(<App></App>)
    expect(app.children().length).toBe(3)
    expect(app.find(Content)).toHaveLength(1)
    expect(app.find(Sidebar)).toHaveLength(1)
    expect(app.find(Sidenav)).toHaveLength(1)
  })
})

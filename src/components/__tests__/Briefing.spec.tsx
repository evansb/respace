import * as React from 'react'

import { shallow } from 'enzyme'
import { Briefing } from '../Briefing'

describe('Briefing', () => {
  it('renders with correct id', () => {
    const briefing = shallow(<Briefing />)
    expect(briefing.find('#rs-briefing').length).toBe(1)
  })
})

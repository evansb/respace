import * as React from 'react'

import { shallow } from 'enzyme'
import { Interpreter } from '../Interpreter'

describe('Interpreter', () => {
  it('renders with correct id', () => {
    const interpreter = shallow(<Interpreter />)
    expect(interpreter.find('#rs-interpreter').length).toBe(1)
  })
})

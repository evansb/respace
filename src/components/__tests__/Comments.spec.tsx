import * as React from 'react'

import { shallow } from 'enzyme'
import { Comments } from '../Comments'

describe('Comments', () => {
  it('renders with correct id', () => {
    const comments = shallow(<Comments />)
    expect(comments.find('#rs-comments').length).toBe(1)
  })
})

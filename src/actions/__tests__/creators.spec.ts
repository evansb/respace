import * as c from '../creators'
import * as types from '../types'

describe('App action creators', () => {
  it('creates toggle sidebar action', () => {
    expect(c.toggleSidebar().type).toBe(types.TOGGLE_SIDEBAR)
  })
})
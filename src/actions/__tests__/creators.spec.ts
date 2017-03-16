import * as c from '../creators'
import * as types from '../types'

describe('App action creators', () => {
  it('creates toggle sidebar action', () => {
    expect(c.toggleSidebar().type).toBe(types.TOGGLE_SIDEBAR)
  })

  it('creates toggle settings dialog open action', () => {
    expect(c.toggleSettingsDialogOpen().type).toBe(
      types.TOGGLE_SETTINGS_DIALOG_OPEN)
  })

  it('creates toggle dark mode action', () => {
    expect(c.toggleDarkMode().type).toBe(
      types.TOGGLE_DARK_MODE)
  })
})
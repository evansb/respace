import { appReducer, AppState, defaultParams } from '../appReducer'

import { setActiveResource, toggleDarkMode, toggleSettingsDialogOpen,
  toggleSidebar } from '../../actions/creators'

describe('App reducer', () => {

  it('should return the initial state', () => {
    expect(appReducer(undefined, {} as any))
      .toEqual(new AppState(defaultParams))
  })

  it('should handle toggle dark mode', () => {
    const state = new AppState(defaultParams)
    let nextState = appReducer(state, toggleDarkMode())
    expect(nextState.darkMode).toBe(true)
    nextState = appReducer(nextState, toggleDarkMode())
    expect(nextState.darkMode).toBe(false)
  })

  it('should handle toggle sidebar', () => {
    const state = new AppState(defaultParams)
    let nextState = appReducer(state, toggleSidebar())
    expect(nextState.sidebarToggled).toBe(false)
    nextState = appReducer(nextState, toggleSidebar())
    expect(nextState.sidebarToggled).toBe(true)
  })

  it('should handle toggle settings dialog', () => {
    const state = new AppState(defaultParams)
    let nextState = appReducer(state, toggleSettingsDialogOpen())
    expect(nextState.settingsDialogOpen).toBe(true)
    nextState = appReducer(nextState, toggleSettingsDialogOpen())
    expect(nextState.settingsDialogOpen).toBe(false)
  })

  it('should handle setting active resource', () => {
    const state = new AppState(defaultParams)
    let nextState = appReducer(state, setActiveResource('task', 2))
    expect(nextState.activeResource).toBe('task')
    expect(nextState.activeResourceId).toBe(2)
    nextState = appReducer(nextState, setActiveResource('briefing', 0))
    expect(nextState.activeResource).toBe('briefing')
  })
})

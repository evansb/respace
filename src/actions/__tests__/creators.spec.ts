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

  it('creates fetch tasks action', () => {
    expect(c.fetchTasks().type).toBe(
      types.FETCH_TASKS)
  })

  it('creates fetch tasks start action', () => {
    expect(c.fetchTasksStart().type).toBe(
      types.FETCH_TASKS_START)
  })

  it('creates fetch tasks success action', () => {
    const tasks = ['test']
    expect(c.fetchTasksSuccess(tasks)).toEqual({
      payload: tasks,
      type: types.FETCH_TASKS_SUCCESS
    })
  })
})

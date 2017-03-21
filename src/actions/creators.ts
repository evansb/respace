import {
  FETCH_TASKS,
  TOGGLE_DARK_MODE,
  TOGGLE_SETTINGS_DIALOG_OPEN,
  TOGGLE_SIDEBAR
} from './types'

export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR
})

export const toggleSettingsDialogOpen = () => ({
  type: TOGGLE_SETTINGS_DIALOG_OPEN
})

export const toggleDarkMode = () => ({
  type: TOGGLE_DARK_MODE
})

export const fetchTasks = () => ({
  type: FETCH_TASKS
})

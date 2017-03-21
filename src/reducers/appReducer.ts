import { Record } from 'immutable'
import { Action } from 'redux'
import {
  TOGGLE_DARK_MODE,
  TOGGLE_SETTINGS_DIALOG_OPEN,
  TOGGLE_SIDEBAR
} from '../actions/types'

export type AppStateParams = {
  sidebarToggled?: boolean
  settingsDialogOpen?: boolean
  darkMode?: boolean
}

export const defaultParams: AppStateParams = {
  darkMode: false,
  settingsDialogOpen: false,
  sidebarToggled: true
}

export class AppState extends Record(defaultParams) {
  darkMode: boolean
  sidebarToggled: boolean
  settingsDialogOpen: boolean

  constructor(params: AppStateParams) {
    params ? super(params) : super()
  }

  with(values: AppStateParams): AppState {
    return this.merge(values) as this
  }
}

const initialState = new AppState(defaultParams)

export const appReducer = (state = initialState, action: Action): AppState => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return state.with({ sidebarToggled: !state.sidebarToggled })
    case TOGGLE_SETTINGS_DIALOG_OPEN:
      return state.with({ settingsDialogOpen: !state.settingsDialogOpen })
    case TOGGLE_DARK_MODE:
      return state.with({ darkMode: !state.darkMode })
    default:
      return state
  }
}

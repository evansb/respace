import { Record } from 'immutable'
import { Action } from 'redux'
import {
  SET_ACTIVE_RESOURCE,
  TOGGLE_DARK_MODE,
  TOGGLE_SETTINGS_DIALOG_OPEN,
  TOGGLE_SIDEBAR
} from '../actions/types'

export type AppStateParams = {
  activeResource?: 'briefing' | 'task',
  activeResourceId?: number,
  sidebarToggled?: boolean
  settingsDialogOpen?: boolean
  darkMode?: boolean
}

export const defaultParams: AppStateParams = {
  activeResource: 'briefing',
  activeResourceId: 0,
  darkMode: false,
  settingsDialogOpen: false,
  sidebarToggled: true
}

export class AppState extends Record(defaultParams) {
  activeResource: ('briefing' | 'task')
  activeResourceId: number
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
    case SET_ACTIVE_RESOURCE:
      return state.with({
        activeResource: (action as any).payload.resource,
        activeResourceId: (action as any).payload.id
      })
    default:
      return state
  }
}

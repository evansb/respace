import { Record } from 'immutable'
import { Action } from 'redux'
import {
  SET_ACTIVE_RESOURCE,
  SET_ACTIVE_WIDGET,
  TOGGLE_DARK_MODE,
  TOGGLE_SETTINGS_DIALOG_OPEN,
  TOGGLE_SIDEBAR
} from '../actions/types'

export type AppStateParams = {
  activeWidget?: ('comments' | 'interpreter' | 'none')
  activeResource?: 'briefing' | 'task',
  activeResourceId?: number,
  sidebarToggled?: boolean
  settingsDialogOpen?: boolean
  darkMode?: boolean
}

export const defaultParams: AppStateParams = {
  activeResource: 'briefing',
  activeResourceId: 0,
  activeWidget: 'none',
  darkMode: false,
  settingsDialogOpen: false,
  sidebarToggled: true
}

export class AppState extends Record(defaultParams) {
  activeWidget: ('comments' | 'interpreter' | 'none')
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
    case SET_ACTIVE_WIDGET:
      return state.with({
        activeWidget: (action as any).payload,
      })
    default:
      return state
  }
}

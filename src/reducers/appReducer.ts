import { Record } from 'immutable'
import { Action } from 'redux'
import { TOGGLE_SIDEBAR } from '../actions/types'

type AppStateParams = {
  sidebarToggled: boolean
}

const defaultParams: AppStateParams = {
  sidebarToggled: true
}

class AppState extends Record(defaultParams) {
  sidebarToggled: boolean

  constructor(params: AppStateParams) {
    params ? super(params) : super()
  }

  with(values: AppStateParams): AppState {
    return this.merge(values) as this
  }
}


const initialState = new AppState(defaultParams)

const appReducer = (state = initialState, action: Action): AppState => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return state.with({
        sidebarToggled: !state.sidebarToggled
      })
    default:
      return state
  }
}

export { appReducer, AppState, AppStateParams }
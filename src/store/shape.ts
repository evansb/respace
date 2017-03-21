import { List } from 'immutable'
import { AppState } from '../reducers/appReducer'
import { ITask } from '../types'

export type State = {
  app: AppState
  tasks: List<ITask>
}

import { List } from 'immutable'
import { AppState } from './reducers/appReducer'

export interface ITask {
  id: number
  title: string
  description: string
  fragment: number
  guided: boolean
}

export type State = {
  app: AppState
  tasks: List<ITask>
}

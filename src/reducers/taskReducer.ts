import { List, Record } from 'immutable'
import { Action } from 'redux'
import { FETCH_TASKS_SUCCESS } from '../actions/types'
import { ITask } from '../types'

const defaultTask = {
  description: '',
  fragment: 0,
  guided: false,
  id: 0,
  title: ''
}

export class Task extends Record(defaultTask) {
  id: number
  title: string
  guided: boolean
  description: string
  fragment: number

  constructor(params: ITask) {
    params ? super(params) : super()
  }

  with(values: ITask): Task {
    return this.merge(values) as this
  }
}

type TasksState = List<Task>

const initialState = List<Task>()

export const taskReducer = (state = initialState, action: Action): TasksState => {
  switch (action.type) {
    case FETCH_TASKS_SUCCESS:
      const tasks: ITask[] = (action as any).payload
      const taskIds = state.map((task) => task && task.id).toSet()
      const mergedITasks: ITask[] = tasks.filter((task) => task && !taskIds.contains(task.id))
      const mergedTasks: Task[] = mergedITasks.map((t) => new Task(t))

      return state.merge(mergedTasks)
    default:
      return state
  }
}

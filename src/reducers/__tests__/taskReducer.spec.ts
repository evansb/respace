import { List } from 'immutable'
import { Task, taskReducer } from '../taskReducer'

import { fetchTasksSuccess } from '../../actions/creators'

describe('Task reducer', () => {
  const tasks = [
    {
      description: 'This is an example of a guided task.',
      fragment: 0,
      guided: true,
      id: 0,
      title: 'Values, Expression, and Functions'
    },
    {
      description: 'This is an example of a non-guided task (old CS1101S style)',
      fragment: 4,
      guided: false,
      id: 1,
      title: 'Understanding Recursion'
    }
  ]

  it('should return the initial state', () => {
    expect(taskReducer(undefined, {} as any))
      .toEqual(List())
  })

  it('should handle FETCH_TASKS_SUCCESS', () => {
    expect(taskReducer(List<Task>(), fetchTasksSuccess(tasks)))
      .toEqual(List.of(new Task(tasks[0]), new Task(tasks[1])))
  })

  it('should handle duplicate IDs', () => {
    const initialState = List<Task>(tasks.map((t) => new Task(t)))
    expect(taskReducer(initialState, fetchTasksSuccess([tasks[0]])))
      .toBe(initialState)
  })
})

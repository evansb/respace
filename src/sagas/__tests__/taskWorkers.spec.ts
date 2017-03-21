import { call, put } from 'redux-saga/effects'
import { createTaskWorker } from '../taskWorkers'

import * as types from '../../actions/types'
import { ITaskApi } from '../../initializer'

describe('Task Worker', () => {
  const mockApi: ITaskApi = {
    fetch: () => Promise.resolve([])
  }

  const worker = createTaskWorker(mockApi)

  describe('Fetch Worker', () => {
    const fetchWorker = worker.fetch()
    it('should dispatch FETCH_TASKS_START', () => {
      expect(fetchWorker.next().value).toEqual(
        put({ type: types.FETCH_TASKS_START }))
    })
    it('then should call fetch task API', () => {
      expect(fetchWorker.next().value).toEqual(
        call(mockApi.fetch))
    })
    it('then should dispatch FETCH_TASKS_SUCCESS', () => {
      expect(fetchWorker.next([]).value).toEqual(
        put({ type: types.FETCH_TASKS_SUCCESS, payload: [] })
      )
    })
    it('then should be done', () => {
      expect(fetchWorker.next()).toEqual({ done: true, value: undefined })
    })
  })
})

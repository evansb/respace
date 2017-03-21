import { SagaIterator } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { ITaskApi } from '../initializer'

import * as types from '../actions/types'

export function createTaskWorker(api: ITaskApi) {
  return {
    *fetch(): SagaIterator {
      yield put({ type: types.FETCH_TASKS_START })
      const tasks = yield call(api.fetch)
      yield put({ type: types.FETCH_TASKS_SUCCESS, payload: tasks })
    }
  }
}

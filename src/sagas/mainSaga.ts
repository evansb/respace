import { SagaIterator, takeEvery } from 'redux-saga'
import { IInitializer } from '../initializer'
import { createTaskWorker } from './taskWorkers'

import * as types from '../actions/types'

export function createMainSaga(initializer: IInitializer) {
  return function* mainSaga(): SagaIterator  {
    const taskWorker = createTaskWorker(initializer.api.tasks)

    yield* takeEvery(types.FETCH_TASKS, taskWorker.fetch)
  }
}

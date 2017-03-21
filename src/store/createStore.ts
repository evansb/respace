import { applyMiddleware, compose, createStore, Middleware,
  StoreEnhancer } from 'redux'
import createSagaMiddleware, { SagaIterator } from 'redux-saga'
import { IInitializer } from '../initializer'
import { createMainSaga } from '../sagas/mainSaga'
import rootReducers from './reducers'

export default (initializer: IInitializer, initialState = {}) => {

  let composeEnchancers = compose

  const sagaMiddleware = createSagaMiddleware()

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    if (typeof devToolsExtension === 'function') {
      composeEnchancers = devToolsExtension
    }
  }

  const store = createStore(
    rootReducers,
    composeEnchancers(
      applyMiddleware(sagaMiddleware)
    )
  )

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const newReducers = require('./reducers').default
      store.replaceReducer(newReducers)
    })
  }

  const mainSaga = createMainSaga(initializer)

  sagaMiddleware.run(mainSaga)

  return store
}

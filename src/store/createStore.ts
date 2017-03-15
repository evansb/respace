import { applyMiddleware, compose, createStore, Middleware,
  StoreEnhancer } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducers from './reducers'

export default (initialState = {}) => {

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

  return store
}

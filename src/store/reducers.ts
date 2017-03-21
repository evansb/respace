import { combineReducers } from 'redux'
import { appReducer as app } from '../reducers/appReducer'
import { taskReducer as tasks } from '../reducers/taskReducer'

export default combineReducers({
  app,
  tasks
})

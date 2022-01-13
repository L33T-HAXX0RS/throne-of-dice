import { all } from 'typed-redux-saga/macro'
import {
  createTaskSaga,
  fetchTasksSaga,
  removeTaskSaga,
  updateTaskSaga,
} from './effects'
import { App } from './app.route'

export default App
export type { AppRouteState } from './app.types'
export const appRouteSaga = all({
  createTaskSaga,
  fetchTasksSaga,
  removeTaskSaga,
  updateTaskSaga,
})

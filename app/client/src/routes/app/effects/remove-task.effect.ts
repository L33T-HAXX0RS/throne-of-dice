import { updateState } from '@optiqs/optiqs'
import { put, takeLatest } from 'typed-redux-saga/macro'
import { createAction } from '~/common/actions'
import { appApi } from '../app.api'
import { errorLens } from '../app.lenses'
import { fetchTasks } from './fetch-tasks.effect'

export const removeTask = createAction<string>('APP/REMOVE_TASK')

export const removeTaskSaga = takeLatest(
  removeTask,
  function* ({ payload: id }) {
    const result = yield* appApi.removeTask(id)
    if (result.isOk()) {
      yield* put(fetchTasks())
    } else {
      yield* put(updateState(errorLens.set(result.unwrapErr())))
    }
  },
)

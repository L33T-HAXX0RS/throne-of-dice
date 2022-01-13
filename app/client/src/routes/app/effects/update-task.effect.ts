import { updateState } from '@optiqs/optiqs'
import { TaskDto } from '@utility/common/dtos'
import { put, takeLatest } from 'typed-redux-saga/macro'
import { createAction } from '~/common/actions'
import { appApi } from '../app.api'
import { errorLens } from '../app.lenses'
import { fetchTasks } from './fetch-tasks.effect'

export const updateTask = createAction<TaskDto>('APP/UPDATE_TASK')

export const updateTaskSaga = takeLatest(
  updateTask,
  function* ({ payload: task }) {
    const result = yield* appApi.updateTask(task)
    if (result.isOk()) {
      yield* put(fetchTasks())
    } else {
      yield* put(updateState(errorLens.set(result.unwrapErr())))
    }
  },
)

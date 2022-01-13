import { updateState } from '@optiqs/optiqs'
import { flow } from 'fp-ts/lib/function'
import { put, takeLatest } from 'typed-redux-saga/macro'
import { createAction } from '~/common/actions'
import { appApi } from '../app.api'
import { errorLens, loadingLens } from '../app.lenses'
import { fetchTasks } from './fetch-tasks.effect'

export const createTask = createAction<string>('APP/CREATE_TASK')

export const createTaskSaga = takeLatest(
  createTask,
  function* ({ payload: text }) {
    const runningSaga = appApi.createTask(text)
    yield* put(
      updateState(flow(loadingLens.set(true), errorLens.set(undefined))),
    )

    const result = yield* runningSaga
    if (result.isOk()) {
      yield* put(fetchTasks())
    } else {
      yield* put(
        updateState(
          flow(loadingLens.set(false), errorLens.set(result.unwrapErr())),
        ),
      )
    }
  },
)

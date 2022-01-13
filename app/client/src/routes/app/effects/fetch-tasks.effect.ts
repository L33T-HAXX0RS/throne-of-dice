import { updateState } from '@optiqs/optiqs'
import { flow } from 'fp-ts/lib/function'
import { put, select, takeLatest } from 'typed-redux-saga/macro'
import { createAction } from '~/common/actions'
import { appApi } from '../app.api'
import {
  errorLens,
  isInitializedLens,
  loadingLens,
  serverLens,
  tasksLens,
} from '../app.lenses'

export const fetchTasks = createAction('APP/FETCH_TASKS')

export const fetchTasksSaga = takeLatest(fetchTasks, function* () {
  const runningSaga = appApi.get()
  yield* put(
    updateState(flow(loadingLens.set(true), isInitializedLens.set(true))),
  )

  const result = yield* runningSaga
  if (result.isOk()) {
    yield* put(
      updateState(
        flow(
          loadingLens.set(false),
          serverLens.set(result.unwrap()),
          errorLens.set(undefined),
        ),
      ),
    )
  } else {
    const tasks = (yield* select(tasksLens.get)) || []
    yield* put(
      updateState(
        flow(
          loadingLens.set(false),
          tasksLens.set(tasks),
          errorLens.set(result.unwrapErr()),
        ),
      ),
    )
  }
})

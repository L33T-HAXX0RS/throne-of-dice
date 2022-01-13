import { pipe } from 'fp-ts/lib/function'
import { lens } from 'monocle-ts'
import { stateLens } from '~/common/lenses'

const appRouteLens = pipe(stateLens, lens.prop('routes'), lens.prop('app'))
export const serverLens = pipe(appRouteLens, lens.prop('server'))
export const tasksLens = pipe(serverLens, lens.prop('tasks'))

const localLens = pipe(appRouteLens, lens.prop('local'))
export const newTaskTextLens = pipe(localLens, lens.prop('newTaskText'))
export const errorLens = pipe(localLens, lens.prop('error'))
export const loadingLens = pipe(localLens, lens.prop('loading'))
export const isInitializedLens = pipe(localLens, lens.prop('isInitialized'))

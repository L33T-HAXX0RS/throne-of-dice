import { lens } from 'monocle-ts'
import { State } from '~/types'

export const stateLens = lens.id<State>()

import { TasksApiGetResponse } from '@utility/common/types/api/tasks.api'
import { RouteState } from '~/types'

export type AppRouteState = RouteState<{
  server: TasksApiGetResponse
  local: {
    newTaskText: string
    error?: string
    loading?: boolean
    isInitialized: boolean
  }
}>

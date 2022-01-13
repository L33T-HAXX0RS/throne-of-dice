import { call } from 'typed-redux-saga/macro'
import { Result } from '@utility/common/result'
import { TasksApiGetResponse } from '@utility/common/types/api/tasks.api'
import { TaskDto } from '@utility/common/dtos'

const getTasks = () =>
  fetch('/tasks')
    .then((resp) => resp.json())
    .then((response) => {
      if (response.error) {
        throw response.error
      }

      return response
    })

const createTask = (text: string) =>
  fetch('/tasks', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json()
      throw error.error
    }
    return response
  })

const updateTask = (task: TaskDto) =>
  fetch('/tasks', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json()
      throw error.error
    }
    return response
  })

const removeTask = (id: string) =>
  fetch('/tasks', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.json()
      throw error.error
    }
    return response
  })

export const appApi = {
  /**
   * Fetch server state
   */
  get: function* (): Generator<unknown, Result<TasksApiGetResponse, string>> {
    try {
      const response: TasksApiGetResponse = yield* call(getTasks)
      return Result.Ok(response)
    } catch (error) {
      return Result.Err(error)
    }
  },

  /**
   * Create a new task
   */
  createTask: function* (
    text: string,
  ): Generator<unknown, Result<void, string>> {
    try {
      yield* call(createTask, text)
      return Result.Ok()
    } catch (error) {
      return Result.Err(error)
    }
  },

  /**
   * Update an existing task
   */
  updateTask: function* (
    task: TaskDto,
  ): Generator<unknown, Result<void, string>> {
    try {
      yield* call(updateTask, task)
      return Result.Ok()
    } catch (error) {
      return Result.Err(error)
    }
  },

  /**
   * Remove a task
   */
  removeTask: function* (id: string): Generator<unknown, Result<void, string>> {
    try {
      yield* call(removeTask, id)
      return Result.Ok()
    } catch (error) {
      return Result.Err(error)
    }
  },
}

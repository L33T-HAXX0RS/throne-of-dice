import { TaskDto } from '@utility/common/dtos'

export interface TaskQuery {
  id?: string
  text?: string
  done?: boolean
}

export interface ITaskAccess {
  /**
   * Get all tasks that match a query.
   */
  query(query: TaskQuery): Promise<TaskDto[]>

  /**
   * Count the number of tasks that match a query.
   */
  count(query: TaskQuery): Promise<number>

  /**
   * Store a task.
   */
  store(task: TaskDto): Promise<void>

  /**
   * Remove all tasks that match the query.
   */
  remove(query: TaskQuery): Promise<void>
}

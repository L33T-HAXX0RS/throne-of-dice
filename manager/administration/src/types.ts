import { TaskQuery } from '@access/task'
import { TaskValidationErrorDto } from '@engine/validation'
import { TaskDto } from '@utility/common/dtos'
import { Result } from '@utility/common/result'

export interface AddTaskDto {
  text: string
}
export type AddTaskError = TaskValidationErrorDto

export interface UpdateTaskDto {
  id: string
  text?: string
  done?: boolean
}
export type UpdateTaskError =
  | TaskValidationErrorDto
  | {
      type: 'does-not-exist'
      message: string
    }

export interface RemoveTaskDto {
  id: string
}
export interface RemoveTaskErrorDto {
  type: 'does-not-exist'
  message: string
}

export interface ITaskManager {
  findTasks(query?: TaskQuery): Promise<TaskDto[]>

  addTask(addTaskDto: AddTaskDto): Promise<Result<TaskDto, AddTaskError>>

  updateTask(
    updateTaskDto: UpdateTaskDto,
  ): Promise<Result<TaskDto, UpdateTaskError>>

  removeTask(
    removeTaskDto: RemoveTaskDto,
  ): Promise<Result<void, RemoveTaskErrorDto>>
}

export type IAdministrationManager = ITaskManager

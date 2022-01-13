import * as uuid from 'uuid'
import { ITaskAccess, TaskQuery } from '@access/task'
import { IValidationEngine, TaskValidationErrorDto } from '@engine/validation'
import { TaskDto } from '@utility/common/dtos'
import { Result } from '@utility/common/result'
import {
  AddTaskDto,
  IAdministrationManager,
  RemoveTaskDto,
  RemoveTaskErrorDto,
  UpdateTaskDto,
  UpdateTaskError,
} from './types'

export * from './types'

export class AdministrationManager implements IAdministrationManager {
  constructor(
    private readonly taskAccess: ITaskAccess,
    private readonly validationEngine: IValidationEngine,
  ) {}

  async findTasks(query: TaskQuery = {}): Promise<TaskDto[]> {
    return this.taskAccess.query(query)
  }

  async addTask(
    addTaskDto: AddTaskDto,
  ): Promise<Result<TaskDto, TaskValidationErrorDto>> {
    const task: TaskDto = {
      ...addTaskDto,
      id: uuid.v4(),
      done: false,
    }

    const validationResult = await this.validationEngine.canStoreTask(task)
    if (validationResult.isErr()) {
      return validationResult
    }

    await this.taskAccess.store(task)
    return Result.Ok(task)
  }

  async updateTask(
    updateTaskDto: UpdateTaskDto,
  ): Promise<Result<TaskDto, UpdateTaskError>> {
    const existingTasks = await this.taskAccess.query({ id: updateTaskDto.id })
    if (existingTasks.length === 0) {
      return Result.Err({
        type: 'does-not-exist',
        message: `Could not find task with ID: ${updateTaskDto.id}`,
      })
    }

    const existingTask = existingTasks[0]
    const updatedTask = {
      ...existingTask,
      ...updateTaskDto,
    }
    const validationResult = await this.validationEngine.canStoreTask(
      updatedTask,
    )
    if (validationResult.isErr()) {
      return validationResult
    }

    await this.taskAccess.store(updatedTask)
    return Result.Ok(updatedTask)
  }

  async removeTask(
    removeTaskDto: RemoveTaskDto,
  ): Promise<Result<void, RemoveTaskErrorDto>> {
    const existingTasks = await this.taskAccess.query({ id: removeTaskDto.id })
    if (existingTasks.length === 0) {
      return Result.Err({
        type: 'does-not-exist',
        message: `Could not find task with ID: ${removeTaskDto.id}`,
      })
    }

    await this.taskAccess.remove({ id: removeTaskDto.id })
    return Result.Ok()
  }
}

import { TaskDto } from '@utility/common/dtos'
import { Result } from '@utility/common/result'

export type TaskValidationErrorDto = {
  type: 'no-text'
  message: 'Text cannot be empty'
}

export interface ITaskValidationEngine {
  canStoreTask(task: TaskDto): Promise<Result<void, TaskValidationErrorDto>>
}

export type IValidationEngine = ITaskValidationEngine

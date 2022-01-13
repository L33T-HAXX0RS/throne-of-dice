import { TaskDto } from '@utility/common/dtos'
import { Result } from '@utility/common/result'
import { TaskValidationErrorDto } from './types'

export const canStoreTask = async (
  task: TaskDto,
): Promise<Result<void, TaskValidationErrorDto>> => {
  if (task.text.trim() === '') {
    return Result.Err({
      type: 'no-text',
      message: 'Text cannot be empty',
    })
  }
  return Result.Ok()
}

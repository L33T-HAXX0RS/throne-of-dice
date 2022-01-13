import { ITaskAccess } from '@access/task'
import { IValidationEngine, TaskValidationErrorDto } from '@engine/validation'
import { TaskDto } from '@utility/common/dtos'
import { Result } from '@utility/common/result'
import { AdministrationManager } from '../'

describe('AdministrationManager', () => {
  const notImplemented = (fnName: string) => () => {
    throw new Error(`'${fnName} is not implemented. Try adding a mock.`)
  }
  const defaultMockTaskAccess: ITaskAccess = {
    query: notImplemented('ITaskAccess.query'),
    count: notImplemented('ITaskAccess.count'),
    store: notImplemented('ITaskAccess.store'),
    remove: notImplemented('ITaskAccess.remove'),
  }
  const defaultMockValidationEngine: IValidationEngine = {
    canStoreTask: notImplemented('IValidation.canStoreTask'),
  }

  describe('addTask', () => {
    test('should return an error if the task is not valid', async () => {
      const validationEngine: IValidationEngine = {
        ...defaultMockValidationEngine,
        async canStoreTask() {
          return Result.Err<TaskValidationErrorDto>({
            type: 'no-text',
            message: 'Text cannot be empty',
          })
        },
      }

      const administrationManager = new AdministrationManager(
        defaultMockTaskAccess,
        validationEngine,
      )
      const result = await administrationManager.addTask({ text: 'Test' })
      expect(result.isErr())
    })
  })

  describe('updateTask', () => {
    test('should return an error if the task is not valid', async () => {
      const tasks: TaskDto[] = [{ id: 'test', text: 'Test', done: false }]

      const taskAccess: ITaskAccess = {
        ...defaultMockTaskAccess,
        query: () => Promise.resolve(tasks),
      }

      const validationEngine: IValidationEngine = {
        ...defaultMockValidationEngine,
        async canStoreTask() {
          return Result.Err<TaskValidationErrorDto>({
            type: 'no-text',
            message: 'Text cannot be empty',
          })
        },
      }

      const administrationManager = new AdministrationManager(
        taskAccess,
        validationEngine,
      )
      const result = await administrationManager.updateTask(tasks[0])
      expect(result.isErr())
    })
  })
})

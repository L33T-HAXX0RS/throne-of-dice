import { TaskDto } from '@utility/common/dtos'
import { ValidationEngine } from '..'

describe('ValidationEngine', () => {
  const validationEngine = new ValidationEngine()

  describe('canStoreTask', () => {
    test('should return Ok when given a valid task', async () => {
      const task: TaskDto = {
        id: '123',
        text: 'Do a thing',
        done: false,
      }

      const result = await validationEngine.canStoreTask(task)
      expect(result.isOk())
    })

    test('should return an error when given a task with an empty text', async () => {
      const task: TaskDto = {
        id: '456',
        text: '',
        done: true,
      }

      const result = await validationEngine.canStoreTask(task)
      result.match({
        Ok() {
          throw new Error(
            'canStoreTask should return an error when given an empty text',
          )
        },
        Err(error) {
          expect(error.type).toBe('no-text')
        },
      })
    })

    test('should return an error when the text is only whitespace', async () => {
      const task: TaskDto = {
        id: '456',
        text: ' \r\n\t',
        done: true,
      }

      const result = await validationEngine.canStoreTask(task)
      result.match({
        Ok() {
          throw new Error(
            'canStoreTask should return an error when given a task with only whitespace',
          )
        },
        Err(error) {
          expect(error.type).toBe('no-text')
        },
      })
    })
  })
})

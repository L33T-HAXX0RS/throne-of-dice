import { Connection } from '@access/common'
import { TaskAccess } from '..'

describe('TaskAccess', () => {
  test('should require a connection', () => {
    new TaskAccess(
      new Connection({
        type: 'sqlite',
        database: ':memory:',
      }),
    )
  })
})

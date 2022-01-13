import { Connection } from 'typeorm'
import { createConnection } from '../src'
import { Todo } from '../src/entity/todo'

describe('Todo', () => {
  let connection: Connection

  beforeAll(async () => {
    connection = await createConnection('access_common_integration')
  })

  afterEach(async () => {
    await connection.close()
  })

  test('should be able to save and return a todo item', async () => {
    const testTodo = {
      id: 'test-id',
      text: 'Test',
      done: true,
    }
    const insertResult = await connection.getRepository(Todo).insert(testTodo)

    expect(insertResult.identifiers[0].id).toBe(testTodo.id)

    const todoItem = await connection
      .getRepository(Todo)
      .createQueryBuilder()
      .where('id = :id', { id: testTodo.id })
      .getOne()

    expect(todoItem).toEqual(testTodo)
  })
})

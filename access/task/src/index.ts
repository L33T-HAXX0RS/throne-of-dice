import { ITaskAccess, TaskQuery } from './types'
import { Connection, Like } from '@access/common'
import { Todo } from '@access/common/entity/todo'
import { isNotNull } from '@utility/common/type-guards'
import { TaskDto } from '@utility/common/dtos'

export * from './types'

export class TaskAccess implements ITaskAccess {
  constructor(private readonly connection: Connection) {}

  async query(query: TaskQuery): Promise<TaskDto[]> {
    const todoRepository = this.connection.getRepository(Todo)
    return todoRepository.find({
      where: [
        query.id === undefined ? null : { id: query.id },
        query.text === undefined ? null : { text: Like(query.text) },
        query.done === undefined ? null : { done: query.done },
      ].filter(isNotNull),
    })
  }

  async count(query: TaskQuery): Promise<number> {
    const todoRepository = this.connection.getRepository(Todo)
    return todoRepository.count({
      where: [
        query.id === undefined ? null : { id: query.id },
        query.text === undefined ? null : { text: Like(query.text) },
        query.done === undefined ? null : { done: query.done },
      ].filter(isNotNull),
    })
  }

  async store(task: TaskDto): Promise<void> {
    const todoRepository = this.connection.getRepository(Todo)
    await todoRepository.save([task])
    return Promise.resolve()
  }

  async remove(query: TaskQuery): Promise<void> {
    const todoRepository = this.connection.getRepository(Todo)
    await todoRepository.delete({
      id: query.id,
    })
    return Promise.resolve()
  }
}

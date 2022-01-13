import { Connection, createConnection } from '@access/common'
import { ITaskAccess, TaskAccess } from '@access/task'
import { ValidationEngine } from '@engine/validation'
import { TaskDto } from '@utility/common/dtos'
import { AdministrationManager } from '../src'
import { AddTaskDto, IAdministrationManager } from '../src/types'

describe('AdministrationManager', () => {
  let administrationManager: IAdministrationManager
  let connection: Connection
  let taskAccess: ITaskAccess

  beforeEach(async () => {
    connection = await createConnection('manager_administration_integration')
    taskAccess = new TaskAccess(connection)
    const validationEngine = new ValidationEngine()
    administrationManager = new AdministrationManager(
      taskAccess,
      validationEngine,
    )
  })

  afterEach(async () => {
    await connection.close()
  })

  test('should return tasks that match a query', async () => {
    const taskWithId: TaskDto = {
      id: 'look-at-this-id',
      text: 'text',
      done: false,
    }

    const tasksWithText: TaskDto[] = [
      {
        id: 'abc',
        text: 'Shared text',
        done: false,
      },
      {
        id: 'abc-123',
        text: 'Shared text',
        done: false,
      },
    ]

    const notDoneTasks = [
      taskWithId,
      ...tasksWithText,
      {
        id: 'def',
        text: 'Other',
        done: false,
      },
    ]

    const doneTasks = [
      {
        id: 'ghi',
        text: 'ghi',
        done: true,
      },
      {
        id: 'jkl',
        text: 'jkl',
        done: true,
      },
    ]

    for (const task of notDoneTasks.concat(doneTasks)) {
      await taskAccess.store(task)
    }

    const byIdResult = await administrationManager.findTasks({
      id: taskWithId.id,
    })
    expect(byIdResult.length).toBe(1)
    expect(byIdResult[0]).toEqual(taskWithId)

    const byTextResult = await administrationManager.findTasks({
      text: 'Shared text',
    })
    expect(byTextResult).toEqual(tasksWithText)

    const notDoneResult = await administrationManager.findTasks({
      done: false,
    })
    expect(notDoneResult).toEqual(notDoneTasks)

    const doneResult = await administrationManager.findTasks({
      done: true,
    })
    expect(doneResult).toEqual(doneTasks)
  })

  test('should succeed when adding a new task', async () => {
    const addTaskDto: AddTaskDto = {
      text: 'Task',
    }
    const addResult = await administrationManager.addTask(addTaskDto)
    addResult.match({
      Ok(task) {
        expect(task.text).toBe(addTaskDto.text)
      },
      Err(err) {
        throw new Error(err.message)
      },
    })
  })

  test('should fail when attempting to add an invalid task', async () => {
    const addTaskDto: AddTaskDto = {
      text: '',
    }
    const addResult = await administrationManager.addTask(addTaskDto)
    addResult.match({
      Ok() {
        throw new Error('Should have failed to add invalid task')
      },
      Err(err) {
        expect(err.type).toBe('no-text')
      },
    })
  })

  test('should succeed when updating an existing task', async () => {
    const addResult = await administrationManager.addTask({ text: 'Test' })
    expect(addResult.isOk()).toBe(true)

    const task = addResult.unwrap()
    expect(task.text).toBe('Test')

    const updateResult = await administrationManager.updateTask({
      id: task.id,
      text: 'End test',
    })
    expect(updateResult.isOk()).toBe(true)

    const updatedTask = updateResult.unwrap()
    expect(updatedTask.id).toBe(task.id)
    expect(updatedTask.text).toBe('End test')
  })

  test('should fail when attempting to update task which does not exist', async () => {
    const updateResult = await administrationManager.updateTask({
      id: 'fake',
      text: 'Will fail',
    })
    expect(updateResult.isErr()).toBe(true)
    expect(updateResult.unwrapErr().type).toBe('does-not-exist')
  })

  test('should fail when attempting to update a task with an empty message', async () => {
    const addResult = await administrationManager.addTask({ text: 'Test' })
    expect(addResult.isOk()).toBe(true)

    const task = addResult.unwrap()
    const updateResult = await administrationManager.updateTask({
      id: task.id,
      text: '',
    })
    expect(updateResult.isErr()).toBe(true)
    expect(updateResult.unwrapErr().type).toBe('no-text')
  })

  test('should succeed when removing an existing task', async () => {
    const addResult = await administrationManager.addTask({ text: 'Test' })
    expect(addResult.isOk()).toBe(true)

    const task = addResult.unwrap()
    const removeResult = await administrationManager.removeTask({
      id: task.id,
    })
    expect(removeResult.isOk()).toBe(true)
  })

  test('should fail when attempting to remove a task which does not exist', async () => {
    const removeResult = await administrationManager.removeTask({
      id: 'does not exist',
    })
    expect(removeResult.isErr()).toBe(true)
    expect(removeResult.unwrapErr().type).toBe('does-not-exist')
  })
})

import { createController, isHttpResponseOK, ServiceManager } from '@foal/core'
import { TasksController } from '~/app/controllers/tasks.controller'
import { AdministrationManager } from '@manager/administration'
import { setupServiceManager } from '~/setup'
import { TaskAccess } from '@access/task'
import { Connection } from '@access/common'
import { TaskDto } from '@utility/common/dtos'

describe('TasksController', () => {
  let controller: TasksController
  let serviceManager: ServiceManager

  beforeEach(async () => {
    serviceManager = await setupServiceManager('app_server_integration')
    controller = createController(TasksController, {
      administrationManager: serviceManager.get(AdministrationManager),
    })
  })

  afterEach(async () => {
    const connection = serviceManager.get(Connection)
    await connection.close()
  })

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const taskAccess = serviceManager.get(TaskAccess)
      const tasks: TaskDto[] = [
        {
          id: 'a',
          text: 'A',
          done: false,
        },
        {
          id: 'b',
          text: 'B',
          done: true,
        },
        {
          id: 'c',
          text: 'C',
          done: false,
        },
      ]

      for (const task of tasks) {
        await taskAccess.store(task)
      }

      const response = await controller.getTasks()
      expect(isHttpResponseOK(response)).toBe(true)
      expect(response.body).toEqual({ tasks: tasks })
    })
  })
})

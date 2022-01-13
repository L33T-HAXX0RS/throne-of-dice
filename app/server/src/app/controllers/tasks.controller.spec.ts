import { strictEqual } from 'assert'
import { getHttpMethod, getPath } from '@foal/core'
import { TasksController } from './tasks.controller'

describe('TasksController', () => {
  describe('has a "getTasks" method that', () => {
    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(TasksController, 'getTasks'), 'GET')
      strictEqual(getPath(TasksController, 'getTasks'), '/')
    })
  })

  describe('has a "storeTask" method that', () => {
    it('should handle requests at POST /.', () => {
      strictEqual(getHttpMethod(TasksController, 'storeTask'), 'POST')
      strictEqual(getPath(TasksController, 'storeTask'), '/')
    })
  })

  describe('has an "updateTask" method that', () => {
    it('should handle requests at PUT /.', () => {
      strictEqual(getHttpMethod(TasksController, 'updateTask'), 'PUT')
      strictEqual(getPath(TasksController, 'updateTask'), '/')
    })
  })

  describe('has a "deleteTask" method that', () => {
    it('should handle requests at DELETE /.', () => {
      strictEqual(getHttpMethod(TasksController, 'deleteTask'), 'DELETE')
      strictEqual(getPath(TasksController, 'deleteTask'), '/')
    })
  })
})

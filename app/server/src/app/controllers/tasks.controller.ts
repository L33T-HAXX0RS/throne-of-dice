import {
  Context,
  Delete,
  dependency,
  Get,
  HttpResponse,
  HttpResponseCreated,
  HttpResponseInternalServerError,
  HttpResponseNoContent,
  HttpResponseOK,
  Post,
  Put,
  ValidateBody,
} from '@foal/core'
import { TasksApiGetResponse } from '@utility/common/types/api/tasks.api'
import { AdministrationManager } from '@manager/administration'

interface PostBody {
  text: string
}

interface PutBody {
  id: string
  text?: string
  done?: boolean
}

export class TasksController {
  @dependency
  administrationManager: AdministrationManager

  @Get('/')
  async getTasks(): Promise<HttpResponse> {
    const tasks = await this.administrationManager.findTasks()
    const response: TasksApiGetResponse = { tasks }
    return new HttpResponseOK(response)
  }

  @Post('/')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      text: { type: 'string' },
    },
    required: ['text'],
    type: 'object',
  })
  async storeTask(ctx: Context): Promise<HttpResponse> {
    const body: PostBody = ctx.request.body
    const result = await this.administrationManager.addTask(body)
    return result.match<HttpResponse>({
      Ok() {
        return new HttpResponseCreated()
      },
      Err(err) {
        return new HttpResponseInternalServerError(err)
      },
    })
  }

  @Put('/')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
      text: { type: 'string' },
      done: { type: 'boolean' },
    },
    required: ['id'],
    type: 'object',
  })
  async updateTask(ctx: Context): Promise<HttpResponse> {
    const body: PutBody = ctx.request.body
    const result = await this.administrationManager.updateTask(body)
    return result.match<HttpResponse>({
      Ok() {
        return new HttpResponseNoContent()
      },
      Err(err) {
        return new HttpResponseInternalServerError(err)
      },
    })
  }

  @Delete('/')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
    type: 'object',
  })
  async deleteTask(ctx: Context): Promise<HttpResponse> {
    const body: PutBody = ctx.request.body
    const result = await this.administrationManager.removeTask(body)
    return result.match<HttpResponse>({
      Ok() {
        return new HttpResponseNoContent()
      },
      Err(err) {
        return new HttpResponseInternalServerError(err)
      },
    })
  }
}

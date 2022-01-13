import {
  Context,
  controller,
  HttpResponse,
  HttpResponseInternalServerError,
  IAppController,
} from '@foal/core'

import { TasksController } from './controllers'

export class AppController implements IAppController {
  subControllers = [controller('/tasks', TasksController)]

  handleError?(
    error: Error,
    ctx: Context,
  ): HttpResponse | Promise<HttpResponse> {
    return new HttpResponseInternalServerError(
      { error: error.message },
      {
        error,
        ctx,
      },
    )
  }
}

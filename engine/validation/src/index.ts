import { canStoreTask } from './task-validation'
import { IValidationEngine } from './types'

export * from './types'

export class ValidationEngine implements IValidationEngine {
  canStoreTask = canStoreTask
}

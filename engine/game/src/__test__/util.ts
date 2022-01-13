import { Result } from '@utility/common/result'

export function expectOk<T, E>(result: Result<T, E>): T {
  if (result.isErr()) {
    throw new Error(`Expected Ok, received: ${result.unwrapErr()}`)
  }
  return result.unwrap()
}

export function expectErr<T, E>(result: Result<T, E>): E {
  if (result.isOk()) {
    throw new Error(`Expected Err, received: ${result.unwrap()}`)
  }
  return result.unwrapErr()
}

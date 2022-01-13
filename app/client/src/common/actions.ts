import { OptiqsAction } from '@optiqs/optiqs'
import type { State } from '~/types'
import { identity } from '@utility/common/fp'

export interface BaseAction {
  readonly type: string
}
export interface Action<Payload> extends BaseAction {
  readonly payload: Payload
  readonly error?: boolean
}

export interface ActionMeta<Payload, Meta> extends Action<Payload> {
  readonly meta: Meta
}

export type AnyAction =
  | BaseAction
  | OptiqsAction<State>
  | ActionMeta<unknown, unknown>

export const hasPayload = (action: BaseAction): action is Action<unknown> =>
  'payload' in action
export const hasMeta = (
  action: BaseAction,
): action is ActionMeta<unknown, Record<string, unknown>> => 'meta' in action

// Specifying the base type here improves type inferrence when creating sagas
export interface ActionFunctionBase {
  toString(): string
  key?: string
}

export interface ActionFunction<Args extends unknown[], R>
  extends ActionFunctionBase {
  (...args: Args): R
}

export type ActionFunction0<P> = ActionFunction<[], P>

export type ActionFunction1<T1, R> = ActionFunction<[T1], R>

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ActionFunctionAny<R = any> extends ActionFunctionBase {
  (...args: any[]): R
}

type AnyArray = any[]

export function createAction(
  actionType: string,
): ActionFunction<[], Action<unknown>>
export function createAction<Payload, Args extends AnyArray = [Payload]>(
  actionType: string,
  payloadCreator?: ActionFunction<Args, Payload>,
): ActionFunction<Args, Action<Payload>>
export function createAction<Meta, Args extends AnyArray>(
  actionType: string,
  payloadCreator: undefined,
  metaCreator: ActionFunction<Args, Meta>,
): ActionFunctionAny<ActionMeta<unknown, Meta>>
export function createAction<Payload, Meta, Args extends AnyArray>(
  actionType: string,
  payloadCreator: ActionFunction<Args, Payload>,
  metaCreator: ActionFunction<Args, Meta>,
): ActionFunction<Args, ActionMeta<Payload, Meta>>
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createAction(
  type: string,
  payloadCreator: (...p: any[]) => any | null | undefined = identity,
  metaCreator: any = null,
) {
  const hasMeta = typeof metaCreator === 'function'
  const finalPayloadCreator: (...args: any[]) => any =
    payloadCreator === identity
      ? identity
      : (head: any, ...args: any[]) =>
          head instanceof Error ? head : payloadCreator(head, ...args)
  const typeString = type.toString()

  const actionCreator = (...args: any[]) => {
    const payload = finalPayloadCreator(...args)
    const action: any = { type }

    if (payload instanceof Error) {
      action.error = true
    }

    if (payload !== undefined) {
      action.payload = payload
    }

    if (hasMeta) {
      action.meta = metaCreator(...args)
    }

    return action
  }

  actionCreator.toString = () => typeString

  return actionCreator
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Gettable } from '@optiqs/projections'
import { mapValues } from '@utility/common/object'
import { State } from '~/types'

export type MappedGetterCollection<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Gettable<State, infer V> ? V : T[keyof T]
}

/**
 * Takes an object mapping keys to lenses and creates a `mapStateToProps` function.
 *
 * ```ts
 * const mapStateToProps = createMapStateToProps({
 *   user: userLens,
 *   product: productLens
 * })
 * ```
 */
export const createMapStateToProps =
  <
    S = State,
    T extends Record<string, Gettable<S, any>> = Record<
      string,
      Gettable<S, any>
    >,
  >(
    getters: T,
  ) =>
  (state: S): MappedGetterCollection<T> =>
    mapValues(getters, (getter) => getter.get(state))

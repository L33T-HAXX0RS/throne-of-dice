import * as Option from 'fp-ts/Option'
import { Lazy } from 'fp-ts/function'
import { NonEmptyArray } from 'fp-ts/NonEmptyArray'
import { Nullish } from './types'
import { isNotNull } from './type-guards'

/**
 * Get the first item in an array.
 * Returns null if the array is non-existent or empty.
 */
export const firstOrNull = <T>(items: Nullish<T[]>): T | null =>
  items && items.length > 0 ? items[0] : null

/**
 * Get the first item in an array.
 * Returns a default value if the array is non-existent or empty.
 */
export const firstOrDefault = <T, U>(
  items: Nullish<T[]>,
  defaultValue: Lazy<U>,
): T | U => (items && items.length > 0 ? items[0] : defaultValue())

/**
 * Determine if an array is non-empty.
 */
export const isNotEmpty = <T>(arr: T[]): arr is NonEmptyArray<T> =>
  arr.length > 0

/**
 * Applies the given function to each element of the list. Return the list comprised of the results for each
 * element where the function returns `Some`
 */
export const choose =
  <T, U>(chooser: (v: T) => Option.Option<U>) =>
  (source: T[]): U[] =>
    source
      .map(chooser)
      .map(Option.getOrElseW(() => null))
      .filter(isNotNull)

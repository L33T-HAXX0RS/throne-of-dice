/**
 * Is the value non-null?
 */
export const isNotNull = <T>(value: T): value is NonNullable<T> =>
  value !== null

/**
 * Is the value not undefined?
 */
export const isNotUndefined = <T>(value: T): value is Exclude<T, undefined> =>
  value !== undefined

/**
 * Is the value not null or undefined?
 */
export const isNotNullish = <T>(
  value: T,
): value is Exclude<T, null | undefined> =>
  value !== null && value !== undefined

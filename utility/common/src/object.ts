export const hasOwnProperty = <TKey extends string = string, TItem = unknown>(
  item: TItem,
  property: TKey,
): item is typeof item & Record<TKey, unknown> => {
  return property in item
}

export function mapValues<
  T extends Record<string | symbol | number, unknown>,
  TResult,
>(obj: T, map: (value: T[keyof T]) => TResult): { [P in keyof T]: TResult } {
  const result = {} as Record<keyof T, TResult>
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = map(obj[key])
    }
  }
  return result
}

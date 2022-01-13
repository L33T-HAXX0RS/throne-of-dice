export interface RouteState<T extends { server: unknown; local?: unknown }> {
  server: Readonly<T['server']>
  local: T['local'] extends undefined ? never : Readonly<T['local']>
}

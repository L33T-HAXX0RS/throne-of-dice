/**
 * Prevent packages from reaching in to packages that would violate the architecture.
 */
const packageName = process.env.npm_package_name
const configArgv = JSON.parse(process.env.npm_config_argv)
const dependencyName = configArgv.original
  .slice(1)
  .find((arg) => !arg.startsWith('-'))

const getScope = (name) => {
  if (!name) {
    return ''
  }
  const match = name.match(/@([^/]+)/)
  if (!match) {
    return name
  }
  const scope = match[1]
  if (scope === 'app') {
    return name.slice(1).split('@')[0]
  }
  return scope
}

const allowedScopeLookup = {
  access: ['utility'],
  'app/client': ['utility'],
  'app/server': ['access', 'engine', 'manager', 'utility'],
  engine: ['access', 'utility'],
  manager: ['access', 'engine', 'utility'],
  utility: [],
}

const packageScope = getScope(packageName)
const dependencyScope = getScope(dependencyName)
const allowedScopes = allowedScopeLookup[packageScope]
const isLocalDependency = !!allowedScopeLookup[dependencyScope]
if (
  allowedScopes &&
  isLocalDependency &&
  !allowedScopes.includes(dependencyScope)
) {
  const allowedPackageTypes = allowedScopes.map((s) => `@${s}`).join(', ')
  console.error(
    `Cannot add @${dependencyScope} packages to @${packageScope} package(s).`,
  )
  console.error(
    `@${packageScope} packages may only import from third-party packages and the following package type(s): ${allowedPackageTypes}`,
  )
  process.exit(1)
}

/**
 * Checks packages for dependencies on monorepo packages and updates the TypeScript project references to match.
 */
const fs = require('fs')
const path = require('path')
const commentJson = require('comment-json')
const { execSync } = require('child_process')
const projectRoot = path.resolve(__dirname, '..')

const toUnixPath = (str) => str.replace(/\\/g, '/')

const workspacePackage = require(path.resolve(projectRoot, 'package.json'))

const workspacePackages = Array.isArray(workspacePackage.workspaces)
  ? workspacePackage.workspaces
  : workspacePackage.workspaces.packages || []

function getTsConfig(filePath, defaultConfig = {}) {
  if (fs.existsSync(filePath)) {
    return {
      path: filePath,
      config: commentJson.parse(fs.readFileSync(filePath).toString()),
    }
  }
  return defaultConfig
}

const packages = workspacePackages
  .map((p) => {
    const packageRoot = path.resolve(projectRoot, p)
    const packagePath = path.resolve(packageRoot, 'package.json')

    const tsconfigPath = path.resolve(packageRoot, 'tsconfig.json')
    const tsconfigAppPath = path.resolve(packageRoot, 'tsconfig.app.json')
    const tsconfigPathsPath = path.resolve(packageRoot, 'tsconfig.paths.json')
    const mainTsConfig = getTsConfig(tsconfigPath)
    const appTsConfig = getTsConfig(tsconfigAppPath, mainTsConfig)
    const pathsTsConfig = getTsConfig(tsconfigPathsPath, mainTsConfig)

    const package = require(packagePath)

    return {
      name: package.name,
      path: packageRoot,
      dependencies: { ...package.dependencies, ...package.devDependencies },
      tsconfig: {
        main: mainTsConfig,
        app: appTsConfig,
        paths: pathsTsConfig,
      },
    }
  })
  .reduce((acc, package) => ({ ...acc, [package.name]: package }), {})

let shouldFormatTsConfigs = false
for (const pkg of Object.values(packages)) {
  const references = []
  const referencePathAliases = []
  for (const packageName of Object.keys(packages)) {
    if (pkg.dependencies[packageName] && !packageName.startsWith('@config')) {
      const referencePath = toUnixPath(
        path.relative(pkg.path, packages[packageName].path),
      )
      references.push({
        path: referencePath,
      })
      referencePathAliases.push({
        name: packageName,
        referencePath,
      })
    }
  }

  const { main, app, paths } = pkg.tsconfig
  if (
    references.length &&
    commentJson.stringify(references) !==
      commentJson.stringify(main.config.references)
  ) {
    main.config.references = references
    app.config.references = references
    if (paths.config.compilerOptions) {
      paths.config.compilerOptions.paths =
        paths.config.compilerOptions.paths || {}
    }
    for (const { name, referencePath } of referencePathAliases) {
      paths.config.compilerOptions.paths[`${name}`] = [`${referencePath}/src`]
      if (!name.startsWith('@config')) {
        paths.config.compilerOptions.paths[`${name}/*`] = [
          `${referencePath}/src/*`,
        ]
      }
    }
    fs.writeFileSync(main.path, commentJson.stringify(main.config, null, 2))
    if (app !== main) {
      fs.writeFileSync(app.path, commentJson.stringify(app.config, null, 2))
    }
    if (paths !== main) {
      fs.writeFileSync(paths.path, commentJson.stringify(paths.config, null, 2))
    }
    console.log(`Updated references for \`${pkg.name}\``)
    shouldFormatTsConfigs = true
  }
}

if (shouldFormatTsConfigs) {
  try {
    execSync('yarn prettier --write **/tsconfig.*json', { cwd: projectRoot })
  } catch (e) {
    console.error(e.toString())
    process.exit(1)
  }
}

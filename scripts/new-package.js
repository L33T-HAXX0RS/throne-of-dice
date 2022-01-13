/**
 * Create a new package.
 *
 * ```sh
 * $ yarn new access task
 * $ yarn new engine validation
 * $ yarn new manager administration
 * ```
 */
const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')
const logSymbols = require('log-symbols')

const types = ['access', 'engine', 'manager', 'utility']

const usage = () => console.error(`Usage: yarn new [type] [name]`)

function log(msg) {
  process.stdout.write(msg)
}

function logSucceed(msg) {
  msg = msg || ''
  console.log(`${msg} ${logSymbols.success}`)
}

function logFail(msg) {
  msg = msg || ''
  console.log(`${msg} ${logSymbols.error}`)
}

async function addToCodeWorkspace(projectRoot, workspaceType, type, name) {
  const packageName = `@${type}/${name}`
  const workspaceFileName = `${workspaceType}.code-workspace`

  log(`Adding to ${workspaceFileName}`)
  try {
    const packagePath = `${type}/${name}`

    const codeWorkspaceFilePath = path.join(projectRoot, workspaceFileName)
    const codeWorkspace = JSON.parse(
      fs.readFileSync(codeWorkspaceFilePath).toString(),
    )
    const alreadyInFolders = !!codeWorkspace.folders.find(
      ({ name }) => name === packageName,
    )
    if (alreadyInFolders) {
      return
    }

    codeWorkspace.folders.push({ name: packageName, path: packagePath })
    codeWorkspace.folders.sort(({ name: nameA }, { name: nameB }) =>
      nameA[0] === '<' ? -1 : nameA.localeCompare(nameB),
    )
    fs.writeFileSync(codeWorkspaceFilePath, JSON.stringify(codeWorkspace))
    execSync(
      `yarn prettier --write --parser json ${workspaceType}.code-workspace`,
    )
    logSucceed()
  } catch (e) {
    logFail(`Error while adding ${packageName} to ${workspaceFileName}`)
    console.error(e)
    process.exit(1)
  }
}

async function main() {
  const [, , type, name] = process.argv
  if (!types.includes(type)) {
    console.error(`Must use one of these types: ${types.join(' ')}`)
    usage()
    process.exit(1)
  }

  if (!name) {
    console.error('Please provide a name')
    usage()
    process.exit(1)
  }

  const packageName = `@${type}/${name}`
  const workspaceRoot = path.join(__dirname, '..')
  try {
    log(`Creating ${packageName}`)
    const templateRoot = path.join(__dirname, '../.config/package-template')
    const packageRoot = path.join(__dirname, '..', type, name)
    await fs.copy(templateRoot, packageRoot)

    // Change package name
    const packagePath = path.join(packageRoot, 'package.json')
    const packageContents = fs.readFileSync(packagePath).toString()
    fs.writeFileSync(
      packagePath,
      packageContents.replace('@package/template', packageName),
    )

    // Remove lines in test file to keep VS Code from screaming
    const testFilePath = path.join(packageRoot, 'src/__test__/hello.test.ts')
    const testFileContents = fs.readFileSync(testFilePath).toString()
    fs.writeFileSync(
      testFilePath,
      testFileContents.split('\n').slice(3).join('\n'),
    )

    // Add to workspace
    const workspacePackagePath = path.join(workspaceRoot, 'package.json')
    const workspacePackage = require(workspacePackagePath)
    workspacePackage.workspaces.packages.push(`${type}/${name}`)
    const prepushIfChanged = {
      ...workspacePackage['prepush-if-changed'],
    }
    prepushIfChanged[
      `${type}/${name}/**/*`
    ] = `cd ${type}/${name} && yarn lint && yarn rebuild && yarn test:ci`

    // Remove any duplicates and sort
    workspacePackage.workspaces.packages = Array.from(
      new Set(workspacePackage.workspaces.packages),
    )
    workspacePackage.workspaces.packages.sort()
    workspacePackage['prepush-if-changed'] = {}
    for (const key of Object.keys(prepushIfChanged).sort()) {
      workspacePackage['prepush-if-changed'][key] = prepushIfChanged[key]
    }

    fs.writeFileSync(
      workspacePackagePath,
      JSON.stringify(workspacePackage, null, 2),
    )

    execSync('yarn install', { cwd: workspaceRoot, stdio: 'ignore' })
    logSucceed()
  } catch (err) {
    logFail()
    console.log(err)
    return
  }

  try {
    log('Configuring Jest')
    // Add mapping to jest.config.js
    const jestConfigPath = path.join(workspaceRoot, '.config/jest.config.js')
    const jestConfig = require(jestConfigPath)
    jestConfig.moduleNameMapper[
      `${packageName}(.*)`
    ] = `<rootDir>/../../${type}/${name}/src$1`

    // Sort keys
    const moduleMapping = JSON.parse(
      JSON.stringify(jestConfig.moduleNameMapper),
    )
    jestConfig.moduleNameMapper = {}
    for (const [key, value] of Object.entries(moduleMapping).sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      jestConfig.moduleNameMapper[key] = value
    }
    fs.writeFileSync(
      jestConfigPath,
      `module.exports = ${JSON.stringify(jestConfig)}`,
    )

    execSync('yarn prettier --write package.json .config/jest.config.js', {
      cwd: workspaceRoot,
    })
    logSucceed()
  } catch (e) {
    logFail()
    console.error(e)
    return
  }

  const typeToWorkspaces = {
    access: ['backend', 'manager', 'engine', 'access'],
    engine: ['backend', 'manager', 'engine', 'access'],
    manager: ['backend', 'manager'],
    utility: ['app', 'backend', 'manager', 'engine', 'access'],
  }

  for (const wp of typeToWorkspaces[type]) {
    await addToCodeWorkspace(workspaceRoot, wp, type, name)
  }

  logSucceed(`Created ${packageName}`)
}

main()

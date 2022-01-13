/**
 * Create and manage decision records (see: /documentation/decisions)
 * Recommendation: run with Yarn. npm will eat flags unless given a special separator
 *
 * ```sh
 * yarn adr -s <number> Title of new decision
 * ```
 *
 * vs.
 *
 * ```sh
 * npm run adr -- -s <number> Title of new decision
 * ```
 */
const fs = require('fs')
const path = require('path')
const adrsDir = path.join(__dirname, '../.adrs')

function printUsage() {
  console.log(`yarn adr [--help | -s <id>] [title of document]`)
  process.exit(1)
}

const toTitleCase = (str) => `${str[0].toUpperCase()}${str.slice(1)}`
const toKebabCase = (str) => str.toLowerCase().replace(/ /g, '-')
const padLeft = (num) => {
  let str = num.toString()
  while (str.length < 5) {
    str = '0' + str
  }
  return str
}

let prevArg = null
let supersededId = null
let title = ''
for (const arg of process.argv.slice(2)) {
  if (prevArg === '-s') {
    supersededId = arg
    prevArg = null
    continue
  }

  if (arg === '-s') {
    prevArg = arg
    continue
  } else if (arg === '--help') {
    printUsage()
  } else {
    if (title) {
      title += ` ${toTitleCase(arg)}`
    } else {
      title = toTitleCase(arg)
    }
  }
}

if (!title) {
  printUsage()
}

const existingRecords = fs
  .readdirSync(adrsDir)
  .filter((filePath) => !Number.isNaN(Number(filePath[0])))

const nextRecordId = padLeft(
  existingRecords.length > 0
    ? Number(existingRecords[existingRecords.length - 1].match(/^\d+/)[0]) + 1
    : 0,
)

let supersededPath
if (supersededId) {
  const paddedId = padLeft(supersededId)
  supersededPath = existingRecords.find((filePath) =>
    filePath.startsWith(paddedId),
  )
  if (supersededPath === undefined) {
    console.error(`Unknown decision record ID: ${supersededId}`)
    process.exit(1)
  }
}

const template = fs
  .readFileSync(path.join(adrsDir, 'template.md'))
  .toString()
  .replace(/^#.*/, `# ${title}`)

const newRecordFilename = `${nextRecordId}-${toKebabCase(title)}.md`
const newRecordPath = path.join(adrsDir, newRecordFilename)
fs.writeFileSync(newRecordPath, template)
console.log('Created', newRecordFilename)

if (supersededPath) {
  const supersededContent = fs
    .readFileSync(path.join(adrsDir, supersededPath))
    .toString()
    .replace(
      /- Status:.*/,
      `- Status: Superseded by [${nextRecordId}-${title}](./${newRecordFilename})`,
    )
  fs.writeFileSync(path.join(adrsDir, supersededPath), supersededContent)
  console.log('Superseded', supersededPath)
}

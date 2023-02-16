const { writeFile } = require('fs')
const { promisify } = require('util')
const { join } = require('path')

const asyncWriteFile = promisify(writeFile)

/**
 * Exports the configuration into a file.
 *
 * @param {object} config Npm Configuration to export.
 * @param {import("../types").Logger} logger Logger instance.
 * @param {bool} dryRun `true` if the user only wants to print the expected operations and not execute them.
 * @returns {Promise<void>}
 */
async function exportConfig (config, logger, dryRun) {
  const path = join(process.cwd(), 'local-npm-config.json')
  let toExport = config
  if (typeof toExport === 'object') {
    toExport = JSON.stringify(config, null, '  ')
  }

  if (dryRun) {
    logger.info(`Configuration to export: ${toExport}`)
    logger.info(`Export path: ${path}`)
    return
  }

  return asyncWriteFile(path, toExport, { encoding: 'utf8' })
}

module.exports = exportConfig

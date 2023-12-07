const { writeFile } = require('fs')
const { promisify } = require('util')
const { join } = require('path')

/** @deprecated Use the fs/promises function */
const asyncWriteFile = promisify(writeFile)

/** @typedef {import('../configuration').NpmInitConfiguration} NpmInitConfiguration  */

/**
 * Transform the core npm configuration object into the corresponding DTO
 * (Data Transfer Object).
 *
 * @param {NpmInitConfiguration} config Configuration to transform.
 */
function createConfigDto (config) {
  const dto = {}

  if (config.authorEmail) {
    dto.author.email = config.authorEmail
  }

  if (config.authorName) {
    dto.author.name = config.authorName
  }

  if (config.authorUrl) {
    dto.author.url = config.authorUrl
  }

  if (config.license) {
    dto.license = config.license
  }

  if (config.version) {
    dto.version = config.version
  }

  return dto
}

/**
 * Exports the configuration into a file.
 *
 * @param {NpmInitConfiguration} config Npm Configuration to export.
 * @param {string} exportDir Path in which the file will be saved
 * @param {import("../types").Logger} logger Logger instance.
 * @param {bool} dryRun `true` if the user only wants to print the expected operations and not execute them.
 * @returns {Promise<void>}
 */
async function exportConfig (config, exportDir, logger, dryRun) {
  const path = join(exportDir, 'local-npm-config.json')
  const dto = createConfigDto(config)
  const dtoJson = JSON.stringify(dto)

  if (dryRun) {
    logger.info(`Configuration to export: ${dtoJson}`)
    logger.info(`Export path: ${path}`)
    return
  }

  return asyncWriteFile(path, dtoJson, { encoding: 'utf8' })
}

module.exports = exportConfig

const { readFile, access } = require('fs/promises')
const { basename } = require('path')

const { request } = require('undici')
const prependCwd = require('prepend-cwd')

/**
 * @typedef { import("../types").Logger } Logger
 */

/**
 * Imports the npm configuration backup from a local file or a remote resource.
 *
 * @param {string} pathToConfig Path to the configuration backup.
 * @param {Logger} logger Logger instance.
 * @returns {object} Configuration to import.
 */
async function importConfig (pathToConfig, logger) {
  if (pathToConfig === null || pathToConfig === undefined) {
    throw new Error('Path should be specified!')
  }

  logger.debug(`importConfig: ${pathToConfig}`)

  // Very naive way... (http and https)
  if (pathToConfig.startsWith('http')) {
    logger.debug('importConfig: Import from remote location')
    // Directly go with the importRemote
    return importRemote(pathToConfig, logger)
  }

  // Local first when the path is dubious
  try {
    logger.debug('importConfig: Local first when in doubt!')
    return await importLocal(pathToConfig, logger)
  } catch (error) {
    // If internal error, rethrow
    if (error.name === 'NonJsonFileError') {
      throw error
    } else {
      logger.debug(`importConfig: Error caught: ${error.message}`)
      // Might be http or https: by default append https
      try {
        const remoteHttp = await importRemote(`https://${pathToConfig}`, logger)
        return remoteHttp
      } catch (remoteError) {
        logger.debug(`importConfig: ${remoteError}`)
        // Manually prepend http in case https failed
        return importRemote(`http://${pathToConfig}`, logger)
      }
    }
  }
}

/**
 * Imports the npm configuration backup from a remote URL.
 *
 * @param {string} path Path to the configuration backup.
 * @param {Logger} logger Logger instance.
 * @returns {object} Configuration to import.
 */
async function importRemote (path, logger) {
  logger.info(`Downloading file from: ${path}`)

  const { body } = await request(path)
  const content = await body.text()

  logger.debug(`importRemote: ${content}`)

  return parseContent(content, logger)
}

/**
 * Parse the configuration backup into an object.
 *
 * @param {string} fileContent File content.
 * @param {Logger} logger Logger instance.
 * @returns {object} Configuration to import.
 */
function parseContent (fileContent, logger) {
  let parsedJSON = {}
  try {
    parsedJSON = JSON.parse(fileContent)
  } catch (error) {
    throw new Error(`Could not parse content: ${fileContent}`, error)
  }

  logger.info(`Parsed content: ${fileContent}`)

  return parsedJSON
}

class NonJsonFileError extends Error {
  constructor (msg) {
    super(msg)
    Error.captureStackTrace(this, NonJsonFileError)
    this.name = 'NonJsonFileError'
  }
}

/**
 * Imports the npm configuration backup from a local file.
 *
 * @param {string} path Path to the configuration backup.
 * @param {Logger} logger Logger instance.
 * @returns {object} Configuration to import.
 */
async function importLocal (path, logger) {
  const toFile = prependCwd(path)
  logger.debug(`importLocal: ${path} -> ${toFile}`)

  // Check if file exists and user has appropriate permissions.
  // It's fine to rethrow the error.
  await access(toFile)

  if (basename(toFile).endsWith('.json')) {
    logger.info(`Reading content from: ${toFile}`)

    const fileContent = await readFile(toFile, { encoding: 'utf8' })

    return parseContent(fileContent, logger)
  }

  throw new NonJsonFileError(`File with path ${toFile} is not a JSON file.`)
}

module.exports = importConfig

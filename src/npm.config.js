const { resolve, join } = require('path')
const { homedir } = require('os')

const Config = require('@npmcli/config')
const { NpmInitConfiguration } = require('./configuration')

/**
 * Creates an npm client/wrapper to load and save configuration.
 *
 * @param {import("./types").Logger} logger Logger instance.
 * @param {bool} dryrun `true` if the user only wants to print the expected operations and not execute them.
 */
function createNpmClient (logger, dryrun) {
  const npmConfig = new Config({
    definitions: Config.typeDefs,
    npmPath: resolve(__dirname, '..'),
    // TODO: keep this until https://github.com/npm/cli/issues/6120 is answered with a proper solution
    // Let process.env override what this function does
    env: {
      npm_config_userconfig: join(homedir(), '.npmrc'),
      npm_config_registry: 'https://registry.npmjs.org/',
      ...process.env
    }
  })

  /**
   * Retrieve the configuration from npm. If npm is unitialized, the array is empty.
   *
   * @returns {Promise<NpmInitConfiguration>} List of configurations from npm.
   */
  async function getConfig () {
    await npmConfig.load()

    logger.debug(`npmConfig.env: ${npmConfig.env}`)

    return new NpmInitConfiguration(
      {
        authorEmail: npmConfig.env.npm_config_init_author_email,
        authorName: npmConfig.env.npm_config_init_author_name,
        authorUrl: npmConfig.env.npm_config_init_author_url,
        license: npmConfig.env.npm_config_init_license,
        version: npmConfig.env.npm_config_init_version
      }
    )
  }

  /**
   * Save npm user's info.
  *
  * @param {Array<Configuration>} config Configuration.
  * @returns {Promise<void>}
  */
  async function saveConfig (config) {
    await npmConfig.load()
    for (const { key, value } of config) {
      npmConfig.set(key, value, 'user')
      logger.info(`Applying ${key} = ${value}`)
    }

    logger.debug(`Valid config? ${npmConfig.validate('user')}`)

    if (dryrun) {
      logger.info(JSON.stringify(npmConfig.data))
      return
    }

    await npmConfig.save('user')
  }

  return {
    getConfig,
    saveConfig
  }
}

module.exports = createNpmClient

const flatten = require('flat')
const { Configuration } = require('../configuration')

/**
 * Transform the configuration to a npm compatible one.
 * Object keys will be especially treated: dots (`.`) will be converted to dashes (`-`).
 *
 * @param {object} config Configuration to transform.
 * @returns {Array<Configuration>} Transformed configuration.
 */
function transformConfig (config) {
  const configToSet = []

  const flatConfig = flatten(config)

  for (const [key, value] of Object.entries(flatConfig)) {
    if (value && value.trim().length > 0) {
      configToSet.push(Configuration.initConfig(key, value))
    }
  }

  return configToSet
}

module.exports = transformConfig

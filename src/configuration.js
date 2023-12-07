
/**
 * Configuration type.
 * @deprecated Use NpmInitConfiguration instead
 */
class Configuration {
  /**
   * Create a configuration keypair.
   * @param {string} key Configuration key.
   * @param {string} value Configuration value.
   */
  constructor (key, value) {
    this.key = key.replace('.', '-')
    this.value = value
  }

  /**
   * Create an `init-` configuration keypair.
   * @param {string} key Configuration key. Will be prefixed with `init-`.
   * @param {string} val Configuration value.
   * @returns {Configuration}.
   */
  static initConfig (key, val) {
    return new Configuration(`init-${key}`, val)
  }
}

/**
 * Configuration object for npm init properties.
 */
class NpmInitConfiguration {
  /**
   * Create a new npm init configuration.
   * By default all values are undefined if not specified.
   * @param {Partial<NpmInitConfiguration>}
   */
  constructor ({ authorName, authorEmail, authorUrl, license, version } = {}) {
    /**
     * Name of the author of the npm project.
     * @type {string?}
     */
    this.authorName = authorName
    /**
     * Email of the author of the npm project.
     * @type {string?}
     */
    this.authorEmail = authorEmail
    /**
     * Url to the author's website.
     * @type {string?}
     */
    this.authorUrl = authorUrl
    /**
     * License of the npm project.
     * @type {string?}
     */
    this.license = license
    /**
     * Initial version of the npm project.
     * @type {string?}
     */
    this.version = version
  }
}

module.exports = {
  Configuration,
  NpmInitConfiguration
}

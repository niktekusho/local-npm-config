/**
 * Example of configuration object
 * @deprecated This should ideally be a "core" class, there's no reason to have it only in tests.
 */
class ConfigExample {
  constructor (name, email, url, license, version) {
    this.author = {
      name,
      email,
      url
    }
    this.license = license
    this.version = version
  }
}

/** Function that does nothing. */
function noop () {}

/** Log class for testing */
class Log {
  constructor (logger) {
    // If a parent logger is not specified (example t.log from ava) then use a noop function
    this._logger = logger || noop
    this._rows = []
  }

  _handleLog (type, args) {
    this._rows.push({ type, args })
    this._logger(args)
  }

  debug (...args) {
    this._handleLog('debug', args)
  }

  info (...args) {
    this._handleLog('info', args)
  }

  warn (...args) {
    this._handleLog('warn', args)
  }

  error (...args) {
    this._handleLog('error', args)
  }

  /**
   * All log rows
   */
  get logs () {
    return this._rows
  }

  /**
   * Log rows of type "info"
   */
  get infos () {
    return this.logs.filter(({ type }) => type === 'info')
  }
}

/**
 * Class to create objects related to file system operations.
 */
class FSOperation {
  /**
   * Create the File System operation.
   * @param {string} path Path on which the File System operation was executed
   * @param {unknown} data Additional data regarding the operation
   */
  constructor (path, data) {
    if (path === undefined || path === null) {
      throw new TypeError(
        'The File System operation path must be specified'
      )
    }

    this._path = path
    this._data = data
  }

  /**
   * Path on which the File System operation was executed
   */
  get path () {
    return this._path
  }

  /**
   * Additional data regarding the operation
   */
  get data () {
    return this._data
  }
}

module.exports = {
  ConfigExample,
  FSOperation,
  Log,
  noop
}

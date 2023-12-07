const { test, beforeEach } = require('tap')
const mock = require('proxyquire')
// Disable original module call
  .noCallThru()

let mockedGlobalConfig = {}
let mockedGlobalConfigSaved = false

class ConfigMock {
  constructor () {
    this.env = mockedGlobalConfig
  }

  set (key, value, scope) {
    const scopedConfig = mockedGlobalConfig[scope] ?? {}
    scopedConfig[key] = value
    mockedGlobalConfig[scope] = scopedConfig
  }

  async load () {
  }

  validate () {
    return true
  }

  async save () {
    mockedGlobalConfigSaved = true
  }
}

/** @type {import("../src/npm.config")} */
const createNpmClient = mock('../src/npm.config', {
  '@npmcli/config': ConfigMock
})
const { Log } = require('./_utils')
const { Configuration } = require('../src/configuration')

let mockedLogger

beforeEach(() => {
  mockedGlobalConfig = {}
  mockedGlobalConfigSaved = false
  mockedLogger = new Log()
})

test('npmClient.saveConfig should call npm config api with expected input and save', async t => {
  const configToApply = [
    new Configuration('testConfig', 'testValue'),
    Configuration.initConfig('test', 'value')
  ]
  const client = createNpmClient(mockedLogger)

  await client.saveConfig(configToApply)

  const expectedConfig = {
    user: {
      testConfig: 'testValue',
      'init-test': 'value'
    }
  }

  t.same(mockedGlobalConfig, expectedConfig)
  t.ok(mockedGlobalConfigSaved)
})

test('npmClient.saveConfig should not call save when dryrun option is true', async t => {
  const configToApply = [
    new Configuration('testConfig', 'testValue'),
    Configuration.initConfig('test', 'value')
  ]

  const client = createNpmClient(mockedLogger, true)

  await client.saveConfig(configToApply)

  t.notOk(mockedGlobalConfigSaved)
})

test('npmClient.getConfig should return only the init properties from npm', async t => {
  // Arrange
  const client = createNpmClient(mockedLogger)
  mockedGlobalConfig.npm_config_userconfig = 'test'
  mockedGlobalConfig.npm_config_init_author_name = 'Pippo'
  mockedGlobalConfig.npm_config_init_author_email = 'pippo@test.com'
  mockedGlobalConfig.npm_config_init_author_url = 'pippo.test.com'
  mockedGlobalConfig.npm_config_init_license = 'MIT'
  mockedGlobalConfig.npm_config_init_version = '0.0.1'
  mockedGlobalConfig.npm_node_execpath = 'test'

  // Act
  const config = await client.getConfig()

  // Assert
  t.equal(config.authorEmail, 'pippo@test.com')
  t.equal(config.authorName, 'Pippo')
  t.equal(config.authorUrl, 'pippo.test.com')
  t.equal(config.license, 'MIT')
  t.equal(config.version, '0.0.1')
})

const { test, beforeEach } = require('tap')
const mock = require('proxyquire')
// Disable original module call
  .noCallThru()

let mockedGlobalConfig = {}
let mockedGlobalConfigSaved = false

class ConfigMock {
  set (key, value, scope) {
    const scopedConfig = mockedGlobalConfig[scope] ?? {}
    scopedConfig[key] = value
    mockedGlobalConfig[scope] = scopedConfig
  }

  async load () {}

  validate () {
    return true
  }

  async save () {
    mockedGlobalConfigSaved = true
  }
}

const setter = mock('../src/npm.config.setter', {
  '@npmcli/config': ConfigMock
})
const { Log } = require('./_utils')
const Configuration = require('../src/configuration')

let mockedLogger

beforeEach(() => {
  mockedGlobalConfig = {}
  mockedGlobalConfigSaved = false
  mockedLogger = new Log()
})

test('setter should call npm config api with expected input and save', async t => {
  const configToApply = [
    new Configuration('testConfig', 'testValue'),
    Configuration.initConfig('test', 'value')
  ]

  await setter(configToApply, mockedLogger)

  const expectedConfig = {
    user: {
      testConfig: 'testValue',
      'init-test': 'value'
    }
  }

  t.same(mockedGlobalConfig, expectedConfig)
  t.ok(mockedGlobalConfigSaved)
})

test('setter should not call save when dryrun option is true', async t => {
  const configToApply = [
    new Configuration('testConfig', 'testValue'),
    Configuration.initConfig('test', 'value')
  ]

  await setter(configToApply, mockedLogger, true)

  t.notOk(mockedGlobalConfigSaved)
})

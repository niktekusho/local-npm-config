const { test } = require('tap')
const { Configuration, NpmInitConfiguration } = require('../src/configuration')

test('new Configuration should create expected object', async t => {
  const config = new Configuration('a.key', 'value')

  t.same(config, { key: 'a-key', value: 'value' })
})

test('Configuration.initConfig should create expected object', async t => {
  const config = Configuration.initConfig('a.key', 'value')

  t.same(config, { key: 'init-a-key', value: 'value' })
})

test('when creating a new NpmInitConfiguration by default is an object with all null properties', async t => {
  const config = new NpmInitConfiguration()

  t.same(config.authorEmail, null)
  t.same(config.authorName, null)
  t.same(config.authorUrl, null)
  t.same(config.license, null)
  t.same(config.version, null)
})

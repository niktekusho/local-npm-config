const { test } = require('tap')

const mock = require('proxyquire')
// Disable original module call
  .noCallThru()

const { FSOperation, Log } = require('../_utils')

const exporter = mock('../../src/io/export', {
  fs: {
    writeFile (path, data, opts, cb) {
      cb(null, new FSOperation(path, data))
    }
  }
})

const logger = new Log()

const { ConfigExample } = require('../_utils')

test('passing object should write the file in the current cwd', async t => {
  const config = new ConfigExample('test')
  const { data, path } = await exporter(config, __dirname, undefined, false)
  t.ok(typeof data === 'string' && data.length > 0)
  t.match(path, /^.*local-npm-config\.json$/)
})

test('passing a dryRun option should write the file content and target path in console', async t => {
  const res = await exporter(new ConfigExample('pippo'), __dirname, logger, true)
  t.same(res, undefined)
  // 2 log operations
  t.ok(logger.logs.length, 2)
  // 1st: config object is printed
  t.match(logger.logs[0].args[0], /.*\{"author": {\}$/)
  // 2nd: config export path is printed
  t.match(logger.logs[1].args[0], /^.*local-npm-config\.json$/)
})

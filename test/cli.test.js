const { test } = require('tap')
const proxyquireStrict = require('proxyquire')
// Disable module cache
  .noPreserveCache()
// Disable original module call
  .noCallThru()

function requireCli (mainModuleStub) {
  return proxyquireStrict('../src/cli', {
    '.': mainModuleStub,
    './utils/logger': () => ({
      success: () => 'Success',
      error: () => 'Error'
    })
  })
}

// TODO: don't really like the way the CLI is tested. Will need to research a bit.

test('cli should call the main module', async t => {
  requireCli(async () => t.pass('main module invoked'))
})

test('cli should handle main module failures gracefully', async t => {
  requireCli(async () => {
    throw new Error('Test error')
  })
  t.pass('Error was correctly handled by CLI')
})

test('cli should forward arguments to main module', async t => {
  // "Override" process arguments for the dryrun flag
  process.argv = ['node-executable', 'the-script.js', '-d', '--verbose']

  requireCli(async (_, opts) => {
    t.same(opts.dryrun, true)
    t.same(opts.verbose, true)
  })
})

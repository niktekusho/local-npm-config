const { writeFile, unlink } = require('fs/promises')
const http = require('http')
const { tmpdir } = require('os')
const { join } = require('path')

const { test, before, teardown } = require('tap')
const { getPort } = require('get-port-please')

const { Log } = require('../_utils')
const importConfig = require('../../src/io/import')

const tmpDir = tmpdir()

let server = null
let port = null

/**
 * Create a temporary file in the OS temporary dir (duh!).
 * @param {string} fileName Name of the file.
 * @param {string?} content Content of the file.
 */
async function createTempFile (fileName, content) {
  const tmpFilePath = join(tmpDir, fileName)
  await writeFile(tmpFilePath, content)
  return tmpFilePath
}

const fixedResponseObj = {
  author: {
    name: 'test',
    email: 'test@test.test'
  },
  license: 'MIT',
  version: '0.1.0'
}

before(async () => {
  const fixedResponseString = JSON.stringify(fixedResponseObj)
  server = await setupServer(fixedResponseString)
  port = server.address().port
})

teardown(() => {
  if (server != null) {
    server.close()
    server = null
  }
})

async function setupServer (fixedResponse) {
  const server = http.createServer((req, res) => {
    // Always return the fixed response (no matter what method we use)
    res.setHeader('Content-Type', 'application/json')
    res.write(fixedResponse)
    res.end()
  })

  const port = await getPort()

  server.listen(port)

  return server
}

test('should throw if the path argument is null', async t => {
  await t.rejects(() => importConfig(null, null), new Error('Path should be specified!'))
})

test('should throw if the path argument is undefined', async t => {
  await t.rejects(() => importConfig(undefined, null), new Error('Path should be specified!'))
})

test('should read the file specified in the argument', async t => {
  // Setup
  const tempFile = await createTempFile('testfile.json', '{"test":"foo"}')
  const logger = new Log()

  const config = await importConfig(tempFile, logger)
  t.ok(typeof config === 'object')
  t.strictSame(config, { test: 'foo' })

  // Teardown
  await unlink(tempFile)
})

test('passing a path to a file without the json extension should throw', async t => {
  // Setup
  const tempFile = await createTempFile('testfile-with-wrong.extension', '{"test":"foo"}')
  const logger = new Log()

  await t.rejects(() => importConfig(tempFile, logger), `File with path ${tempFile} is not a JSON file.`)

  // Teardown
  await unlink(tempFile)
})

test('passing a path to a .json file which is not parseable should throw', async t => {
  // Setup
  const tempFile = await createTempFile('testfile.json', '{"test"}')
  const logger = new Log()

  await t.rejects(() => importConfig(tempFile, logger), `File with path ${tempFile} is not a JSON file.`)

  // Teardown
  await unlink(tempFile)
})

test('passing an HTTP url as path argument should initiate download', async t => {
  // Server is created in the before hook
  const fakeUrl = `http://localhost:${port}/fake_data.json`
  const logger = new Log()
  const res = await importConfig(fakeUrl, logger)
  t.same(res, fixedResponseObj)
})

test('passing a url without protocol as path argument should first go through the local path and then fall back to the remote one (http)', async t => {
  const fakeUrl = `localhost:${port}/fake_data.json`
  const logger = new Log()
  const res = await importConfig(fakeUrl, logger)
  t.ok(res)
})

test('passing a url without protocol as path argument should first go through the local path and then fall back to the remote one (https)', async t => {
  const apiUrl = 'randomuser.me/api/?results=1'
  const logger = new Log()
  const res = await importConfig(apiUrl, logger)
  t.ok(res)
})

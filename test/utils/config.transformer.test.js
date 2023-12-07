const { test } = require('tap')
const { Configuration } = require('../../src/configuration')
const transformer = require('../../src/utils/config.transformer')

const answers = {
  author: {
    name: 'test',
    email: 'test@t.t',
    url: ''
  },
  license: 'MIT',
  version: '0.0.1'
}

test('config.transformer should return an array of transformed config', async t => {
  const transformed = transformer(answers)
  t.strictSame(transformed[0], Configuration.initConfig('author-name', 'test'))
  t.strictSame(transformed[1], Configuration.initConfig('author-email', 'test@t.t'))
  t.strictSame(transformed[2], Configuration.initConfig('license', 'MIT'))
  t.strictSame(transformed[3], Configuration.initConfig('version', '0.0.1'))
})

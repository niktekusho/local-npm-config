const { test } = require('tap')
const { validate } = require('../../src/questions/author.url')

test('author url prompt validation should succeed when URL is parse-able', async t => {
  t.ok(validate('https://github.com'))
})

test('author url prompt validation should succeed when URL is not specified', async t => {
  t.ok(validate(''))
  t.ok(validate())
  t.ok(validate(null))
})

test('author url prompt validation should return a message when URL is not parse-able', async t => {
  const url = 'a//github.com'
  t.equal(validate(url), `${url} is not a valid Url.`)
})

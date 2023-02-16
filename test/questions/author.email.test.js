const { test } = require('tap')
const { validate } = require('../../src/questions/author.email')

test('email prompt validation where email has @ should return true', async t => {
  t.ok(validate('a@a.a'))
})

test('email prompt validation where email does NOT have @ should return a string message', async t => {
  t.equal(validate('a'), 'I won\'t do a full validation for the email, but at least the @ must be there, right? ;)')
})

test('email prompt validation without input should return true', async t => {
  t.ok(validate())
})

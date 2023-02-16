const { test } = require('tap')

const mock = require('proxyquire')
// Disable original module call
  .noCallThru()

const prompt = mock('../src/prompt.js', {
  inquirer: {
    registerPrompt: () => { },
    prompt: async questions => questions
  }
})

test('prompt should use inquirer to return get answers from the user', async t => {
  const questions = [{
    type: 'input',
    name: 'test'
  }]
  const answers = await prompt(questions)
  t.equal(answers, questions)
})

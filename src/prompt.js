const inquirer = require('inquirer')
const autocompletePrompt = require('inquirer-autocomplete-prompt')

async function prompt (questions) {
  inquirer.registerPrompt('autocomplete', autocompletePrompt)
  return inquirer.prompt(questions)
}

module.exports = prompt

const versions = [
  '0.0.0', '0.0.1', '0.1.0', '1.0.0'
]

const versionsAsChoices = versions.map(version => ({ name: version, value: version }))

const choices = [{ name: 'Leave unset...', value: '' }, ...versionsAsChoices]

module.exports = {
  type: 'list',
  name: 'version',
  message: 'What default version do you want to set in the npm config?',
  choices
}

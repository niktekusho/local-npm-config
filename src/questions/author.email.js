const validationMsg = 'I won\'t do a full validation for the email, but at least the @ must be there, right? ;)'

/**
 * Simple email validation function.
 *
 * @param {string} email String to validate to an email.
 * @returns {true|string} `true` if the supplied string is a valid email or an error message otherwise.
 */
function validateEmail (email) {
  if (email.includes('@')) {
    return true
  }

  return validationMsg
}

module.exports = {
  type: 'input',
  name: 'author.email',
  message: 'What is the email you want to set in the npm config?',
  // Validate the email only if the user inserted it
  validate: email => email ? validateEmail(email) : true
}

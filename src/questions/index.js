const authorEmail = require('./author.email')
const authorName = require('./author.name')
const authorUrl = require('./author.url')
const license = require('./license')
const version = require('./version')

const questions = []

questions.push(authorName)
questions.push(authorEmail)
questions.push(authorUrl)
questions.push(license)
questions.push(version)

module.exports = questions

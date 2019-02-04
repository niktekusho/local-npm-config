const execa = require('execa');

module.exports = async (config, value) => execa('npm', ['set', config, value]);

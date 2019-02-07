const execa = require('execa');

module.exports = async (config, value, logger) => {
	logger.debug(`About to run: npm set ${config} ${value}`);
	return execa('npm', ['set', config, value]);
};

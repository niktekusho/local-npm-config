const execa = require('execa');

module.exports = async (config, value, logger, dryrun) => {
	logger.debug(`About to run: npm set ${config} ${value}`);
	if (dryrun) {
		logger.info(`npm set ${config} ${value}`);
		return;
	}

	return execa('npm', ['set', config, value]);
};

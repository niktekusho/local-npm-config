const execa = require('execa');

module.exports = (config, value, logger, dryrun) => {
	logger.debug(`About to run: npm set ${config} ${value}`);
	if (dryrun) {
		logger.info(`npm set ${config} ${value}`);
		return;
	}

	logger.info(`Applying ${config}...`);

	const {stdout, stderr} = execa.sync('npm', ['set', config, value]);
	// Log both of them in the verbose mode
	logger.debug(`stdout: ${stdout}, stderr: ${stderr}`);
};

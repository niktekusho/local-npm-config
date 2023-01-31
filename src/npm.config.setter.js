const execa = require('execa');

module.exports = (config, value, logger, dryrun) => {
	logger.info(`Applying ${config}...`);

	if (dryrun) {
		const command = `npm set ${config}=${value} --location=user`;
		logger.info(command);
		return;
	}

	const {stdout, stderr, command} = execa.sync('npm', ['set', `${config}=${value}`, '--location=user']);

	logger.debug(`Command executed: ${command}`);
	// Log both of them in the verbose mode
	logger.debug(`stdout: ${stdout}, stderr: ${stderr}`);
};

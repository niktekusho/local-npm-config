const prompt = require('./prompt');
const questions = require('./questions');
const npmConfigSet = require('./npm.config.setter');
const transformConfig = require('./utils/config.transformer');
const minimize = require('./utils/object.minimizer');
const {
	exportConfig,
	importConfig,
	validate
} = require('./io');

async function main(logger, options) {
	const opts = {
		dryrun: false,
		exportConfig: false,
		importConfig: false,
		verbose: false,
		...options
	};

	logger.debug(`main: ${opts}`);

	const {
		dryrun,
		exportConfig: exportConfigOpt,
		importConfig: importConfigOpt,
		verbose
	} = opts;

	// If both import and export are selected the user might be:
	// a) trolling (most probably XD)
	// b) drunk...
	// It's better to fail fast now.
	if (importConfigOpt && exportConfigOpt) {
		logger.error('You selected both import and export options. I\'m afraid but you will have to choose one!');
		return;
	}

	if (verbose) {
		logger.info('Verbose mode enabled');
	}

	if (dryrun) {
		logger.info('Dryrun mode enabled');
	}

	if (exportConfigOpt) {
		logger.info('Configuration export enabled');
	}

	if (importConfigOpt) {
		logger.info('Applying local npm configuration from file');
	}

	// Fetch config either from file or from a prompt
	const config = importConfigOpt ? await importConfig(importConfigOpt, logger, dryrun) : await prompt(questions);

	logger.debug(`main: ${config}`);

	const minimizedConfig = minimize(config);
	logger.debug(`main: ${minimizedConfig}`);

	// Add the export promise dinamically
	if (exportConfigOpt) {
		logger.debug(`main: Exporting config: ${JSON.stringify(minimizedConfig)}`);
		const result = validate(minimizedConfig);
		if (result.isValid) {
			await exportConfig(minimizedConfig, logger, dryrun);
		} else {
			// Should not happen since we know what we are exporting!
			logger.error('Configuration does not match expected schema.');
			logger.debug(`main: ${result.errors}`);
		}
	} else {
		const filteredConfig = transformConfig(config);
		logger.debug(`main: ${filteredConfig}`);

		const initConfig = filteredConfig.map(config => ({
			...config,
			config: `init.${config.config}`
		}));
		logger.debug(`main: ${initConfig}`);

		for (const {config, value} of initConfig) {
			npmConfigSet(config, value, logger, dryrun);
		}
	}
}

module.exports = main;

const prompt = require('./prompt');
const questions = require('./questions');
const npmConfigSet = require('./npm.config.setter');
const transformConfig = require('./utils/config.transformer');
const minimize = require('./utils/object.minimizer');
const {
	exportConfig,
	validate
} = require('./io');

async function main(logger, options) {
	options = {
		...options
	};

	logger.debug(options);

	const {
		dryrun,
		exportConfig: exportConfigOpt,
		verbose
	} = options;

	if (verbose) {
		logger.info('Verbose mode enabled');
	}

	if (dryrun) {
		logger.info('Dryrun mode enabled');
	}

	if (exportConfigOpt) {
		logger.info('Configuration export enabled');
	}

	const answers = await prompt(questions);
	logger.debug(answers);

	const minimizedAnswers = minimize(answers);
	logger.debug(minimizedAnswers);

	const commandsToRun = [];

	// Add the export promise dinamically
	if (exportConfigOpt) {
		logger.debug(`Exporting config: ${JSON.stringify(minimizedAnswers)}`);
		const result = validate(minimizedAnswers);
		if (result.isValid) {
			commandsToRun.push(exportConfig(minimizedAnswers, logger, dryrun));
		} else {
			// Should not happen since we know what we are exporting!
			logger.error('Configuration does not match expected schema.');
			logger.debug(result.errors);
		}
	} else {
		const filteredConfig = transformConfig(answers);
		logger.debug(filteredConfig);

		const initConfig = filteredConfig.map(config => ({
			...config,
			config: `init.${config.config}`
		}));
		logger.debug(initConfig);

		commandsToRun.push(initConfig.map(({
			config,
			value
		}) => npmConfigSet(config, value, logger, dryrun)));
	}

	await Promise.all(commandsToRun);
}

module.exports = main;

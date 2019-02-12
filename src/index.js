const prompt = require('./prompt');
const questions = require('./questions');
const npmConfigSet = require('./npm.config.setter');
const transformConfig = require('./config.transformer');
const {exportConfig, validate} = require('./io');

async function main(logger, options) {
	options = {
		...options
	};

	const {dryrun, exportConfig: exportConfigOpt, verbose} = options;

	if (verbose) {
		logger.info('Verbose mode enabled');
	}

	if (dryrun) {
		logger.info('Dryrun mode enabled');
	}

	const answers = await prompt(questions);

	logger.debug(answers);

	const filteredConfig = transformConfig(answers);

	logger.debug(filteredConfig);

	const initConfig = filteredConfig.map(config => ({...config, config: `init.${config.config}`}));

	logger.debug(initConfig);

	const commandsToRun = initConfig.map(({config, value}) => npmConfigSet(config, value, logger, dryrun));

	// Add the export promise dinamically
	if (exportConfigOpt) {
		logger.debug('Exporting config...');
		if (validate(filteredConfig)) {
			commandsToRun.push(exportConfig(filteredConfig));
		} else {
			logger.error('Configuration does not match expected schema.');
		}
	}

	await Promise.all(commandsToRun);
}

module.exports = main;

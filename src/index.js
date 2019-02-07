const prompt = require('./prompt');
const questions = require('./questions');
const npmConfigSet = require('./npm.config.setter');
const transformConfig = require('./config.transformer');

async function main(logger) {
	const answers = await prompt(questions);

	logger.debug(answers);

	const filteredConfig = transformConfig(answers);

	logger.debug(filteredConfig);

	const initConfig = filteredConfig.map(config => ({...config, config: `init.${config.config}`}));

	logger.debug(initConfig);

	const commandsToRun = initConfig.map(({config, value}) => npmConfigSet(config, value, logger));

	await Promise.all(commandsToRun);
}

module.exports = main;

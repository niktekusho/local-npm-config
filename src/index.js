const prompt = require('./prompt');
const questions = require('./questions');
const npmConfigSet = require('./npm.config.setter');
const transformConfig = require('./config.transformer');

async function main() {
	const answers = await prompt(questions);

	const filteredConfig = transformConfig(answers);

	console.log(filteredConfig);

	const initConfig = filteredConfig.map(config => ({...config, config: `init.${config.config}`}));

	console.log(initConfig);

	const commandsToRun = initConfig.map(({config, value}) => npmConfigSet(config, value));

	await Promise.all(commandsToRun);
}

module.exports = main;

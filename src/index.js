const flatten = require('flat');

const prompt = require('./prompt');
const questions = require('./questions');
const npmConfigSet = require('./npm.config.setter');

function configFilter(config) {
	const configToSet = [];

	const flatConfig = flatten(config);

	Object.keys(flatConfig).forEach(key => {
		const value = flatConfig[key];
		if (value && value.trim().length > 0) {
			configToSet.push({config: key, value});
		}
	});

	return configToSet;
}

async function main() {
	const answers = await prompt(questions);

	const filteredConfig = configFilter(answers);

	console.log(filteredConfig);

	const initConfig = filteredConfig.map(config => ({...config, config: `init.${config.config}`}));

	console.log(initConfig);

	const commandsToRun = initConfig.map(({config, value}) => npmConfigSet(config, value));

	await Promise.all(commandsToRun);
}

module.exports = main;

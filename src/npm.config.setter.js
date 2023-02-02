const {resolve, join} = require('path');
const {homedir} = require('os');

const Config = require('@npmcli/config');

/**
 * Save npm user's info.
 *
 * @param {Array<Configuration>} config Configuration.
 * @param {import("./types").Logger} logger Logger instance.
 * @param {bool} dryrun `true` if the user only wants to print the expected operations and not execute them.
 * @returns {Promise<void>}
 */
async function saveConfig(config, logger, dryrun) {
	const npmConfig = new Config({
		definitions: Config.typeDefs,
		npmPath: resolve(__dirname, '..'),
		// TODO: keep this until https://github.com/npm/cli/issues/6120 is answered with a proper solution
		// Let process.env override what this function does
		env: {
			// eslint-disable-next-line camelcase
			npm_config_userconfig: join(homedir(), '.npmrc'),
			// eslint-disable-next-line camelcase
			npm_config_registry: 'https://registry.npmjs.org/',
			...process.env
		}
	});

	await npmConfig.load();

	for (const {key, value} of config) {
		npmConfig.set(key, value, 'user');
		logger.info(`Applying ${key} = ${value}`);
	}

	logger.debug(`Valid config? ${npmConfig.validate('user')}`);

	if (dryrun) {
		logger.info(JSON.stringify(npmConfig.data));
		return;
	}

	await npmConfig.save('user');
}

module.exports = saveConfig;

const flatten = require('flat');

/**
 * Transform the configuration to a npm compatible one.
 * Object keys will be especially treated: dots (`.`) will be converted to dashes (`-`).
 *
 * @param {object} config Configuration to transform.
 * @returns {import("../types").Configuration} Transformed configuration.
 */
function transformConfig(config) {
	const configToSet = [];

	const flatConfig = flatten(config);

	for (const [key, value] of Object.entries(flatConfig)) {
		if (value && value.trim().length > 0) {
			const npmKey = key.replace('.', '-');
			configToSet.push({config: npmKey, value});
		}
	}

	return configToSet;
}

module.exports = transformConfig;

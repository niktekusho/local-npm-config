const flatten = require('flat');

module.exports = config => {
	const configToSet = [];

	const flatConfig = flatten(config);

	for (const [key, value] of Object.entries(flatConfig)) {
		if (value && value.trim().length > 0) {
			configToSet.push({config: key, value});
		}
	}

	return configToSet;
};

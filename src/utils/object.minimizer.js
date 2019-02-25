// TODO: for now use a recursive solution
function minimize(object) {
	const entries = [...Object.entries(object)];
	const minimized = {};

	while (entries.length > 0) {
		const [key, value] = entries.shift();
		if (value) {
			minimized[key] = value;
			if (typeof value === 'object' && Object.keys(value).length > 0) {
				minimized[key] = minimize(object[key]);
			}
		}
	}

	return minimized;
}

module.exports = minimize;

function minimize(object) {
	debugger;
	const entries = [...Object.entries(object)];
	const minimized = {};

	while (entries.length > 0) {
		const [key, value] = entries.shift();
		if (typeof value === 'object') {
			minimized[key] = {};
			entries.push(...Object.entries(value));
		} else if (value) {
			minimized[key] = value;
		}
	}

	return minimized;
}

module.exports = minimize;

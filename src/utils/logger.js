const signale = require('signale');

// Simple wrap for now
const originalDebug = signale.debug;

signale.debug = (...args) => {
	if (signale.verbose) {
		return originalDebug(...args);
	}

	return 'Disabled';
};

module.exports = verbose => {
	signale.verbose = verbose || false;
	return signale;
};

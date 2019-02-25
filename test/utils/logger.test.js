import test from 'ava';

const loggerFactory = require('../../src/utils/logger');

// Not testing here that the logger actually writes on stdout/stderr since that should be taken care by signale
test('logger should have required functions to log stuff', t => {
	const logger = loggerFactory(true);
	t.truthy(logger.debug);
	t.truthy(logger.success);
	t.truthy(logger.warn);
	t.truthy(logger.error);
});

test('logger.debug should return undefined if logger is verbose', t => {
	const logger = loggerFactory(true);
	t.true(logger.verbose);

	const output = logger.debug('test');
	t.is(output, undefined);
});

test('logger.debug should return \'Disabled\' if logger is not verbose', t => {
	const logger = loggerFactory(false);
	t.false(logger.verbose);

	const output = logger.debug('test');
	t.is(output, 'Disabled');
});


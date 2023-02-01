const {test} = require('tap');
const loggerFactory = require('../../src/utils/logger');

// Not testing here that the logger actually writes on stdout/stderr since that should be taken care by signale
test('logger should have required functions to log stuff', async t => {
	const logger = loggerFactory(true);
	t.ok(logger.debug);
	t.ok(logger.success);
	t.ok(logger.warn);
	t.ok(logger.error);
});

test('logger.debug should return undefined if logger is verbose', async t => {
	const logger = loggerFactory(true);
	t.ok(logger.verbose);

	const output = logger.debug('test');
	t.equal(output, undefined);
});

test('logger.debug should return \'Disabled\' if logger is not verbose', async t => {
	const logger = loggerFactory(false);
	t.notOk(logger.verbose);

	const output = logger.debug('test');
	t.equal(output, 'Disabled');
});


import test from 'ava';

const mock = require('mock-require');

mock('execa', async (...args) => args);

const setter = require('../src/npm.config.setter');

test('setter should call execa with "npm set config value"', async t => {
	const mockedLogger = {
		debug: () => {}
	};
	const args = await setter('testConfig', 'testValue', mockedLogger);
	t.is(args[0], 'npm');
	t.deepEqual(args[1], ['set', 'testConfig', 'testValue']);
	mock.stop('execa');
});

test('setter should not call execa when dryrun option is true', async t => {
	let infoCalled = false;
	const mockedLogger = {
		debug: () => {},
		info: () => {
			infoCalled = true;
		}
	};
	const args = await setter('testConfig', 'testValue', mockedLogger, true);
	t.is(args, undefined);
	t.true(infoCalled);
});

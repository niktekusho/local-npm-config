import test from 'ava';

const mock = require('mock-require');

mock('execa', async (...args) => args);

const setter = require('../src/npm.config.setter');

test('setter should call execa with "npm set config value"', async t => {
	const args = await setter('testConfig', 'testValue');
	t.is(args[0], 'npm');
	t.deepEqual(args[1], ['set', 'testConfig', 'testValue']);
	mock.stop('execa');
});

import test from 'ava';

const mock = require('mock-require');

const answers = {
	author: {
		name: 'test',
		email: 'test@t.t',
		url: ''
	},
	license: 'MIT',
	version: '0.0.1'
};

const promptModule = '../src/prompt';
mock(promptModule, async () => answers);

const configSetterModule = '../src/npm.config.setter';
mock(configSetterModule, async () => undefined);

const loggerFactoryMock = logger => ({
	debug: logger,
	error: logger,
	info: logger,
	log: logger,
	warn: logger
});

const main = require('../src');

test('prompt should be an async function', async t => {
	try {
		await main(loggerFactoryMock(t.log));
		t.pass();
		clearMock();
	} catch (error) {
		clearMock();
		t.fail(error);
	}
});

function clearMock() {
	mock.stop(promptModule);
	mock.stop(configSetterModule);
}

import test from 'ava';

const mock = require('mock-require');

const mainModule = '../src/index';

const loggerModule = '../src/logger';
mock(loggerModule, () => ({
	success: () => 'Success',
	error: () => 'Error'
}));

test('cli should call the main module', t => {
	try {
		let mainModuleCalled = false;
		mock(mainModule, async () => {
			mainModuleCalled = true;
		});
		mock.reRequire('../src/cli');
		const cli = require('../src/cli');
		// CLI module doesn't export stuff
		t.deepEqual(cli, {});
		t.true(mainModuleCalled);
		mock.stop(mainModule);
	} catch (error) {
		mock.stop(mainModule);
		t.fail(error);
	}
});

test('cli should handle main module failures gracefully', t => {
	try {
		mock(mainModule, async () => {
			throw new Error('Test error');
		});
		mock.reRequire('../src/cli');
		const cli = require('../src/cli');
		t.deepEqual(cli, {});
		mock.stop(mainModule);
	} catch (error) {
		mock.stop(mainModule);
		t.fail(`The CLI should not have a rejected promise: ${error.message}`);
	}
});

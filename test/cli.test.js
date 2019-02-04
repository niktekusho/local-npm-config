import test from 'ava';

const mock = require('mock-require');

let mainModuleCalled = false;

const mainModule = '../src/index';
mock(mainModule, async () => {
	mainModuleCalled = true;
});

test('cli should call the main module', t => {
	try {
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

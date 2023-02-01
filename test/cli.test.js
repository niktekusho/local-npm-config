const {test} = require('tap');
const mock = require('mock-require');

const mainModule = '../src/index';

const loggerModule = '../src/logger';
mock(loggerModule, () => ({
	success: () => 'Success',
	error: () => 'Error'
}));

// TODO: don't really like the way the CLI is tested. Will need to research a bit.

test('cli should call the main module', async t => {
	try {
		let mainModuleCalled = false;
		mock(mainModule, async () => {
			mainModuleCalled = true;
		});
		mock.reRequire('../src/cli');
		const cli = require('../src/cli');
		// CLI module doesn't export stuff
		t.strictSame(cli, {});
		t.ok(mainModuleCalled);
		mock.stop(mainModule);
	} catch (error) {
		mock.stop(mainModule);
		t.fail(error);
	}
});

test('cli should handle main module failures gracefully', async t => {
	try {
		mock(mainModule, async () => {
			throw new Error('Test error');
		});
		mock.reRequire('../src/cli');
		const cli = require('../src/cli');
		t.strictSame(cli, {});
		mock.stop(mainModule);
	} catch (error) {
		mock.stop(mainModule);
		t.fail(`The CLI should not have a rejected promise: ${error.message}`);
	}
});

test('cli should forward arguments to main module', async t => {
	try {
		// "Override" process arguments for the dryrun flag
		process.argv = ['node-executable', 'the-script.js', '-d', '--verbose'];
		mock(mainModule, async (_, opts) => {
			t.same(opts.dryrun, true);
			t.same(opts.verbose, true);
		});
		mock.reRequire('../src/cli');
		// eslint-disable-next-line import/no-unassigned-import
		require('../src/cli');
		mock.stop(mainModule);
	} catch (error) {
		mock.stop(mainModule);
		t.fail(error);
	}
});

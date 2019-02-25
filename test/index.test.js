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

const importModule = '../src/io/import';
mock(importModule, async () => answers);

class LoggerMock {
	constructor(logger) {
		this._logger = logger;
		this._logs = [];
	}

	_handleLog(type, ...args) {
		this._logs.push({type, args});
		this._logger(args);
	}

	debug(...args) {
		this._handleLog('debug', args);
	}

	info(...args) {
		this._handleLog('info', args);
	}

	warn(...args) {
		this._handleLog('warn', args);
	}

	error(...args) {
		this._handleLog('error', args);
	}

	get logs() {
		return this._logs;
	}
}

const main = require('../src');

test('prompt should be an async function', async t => {
	try {
		await main(new LoggerMock(t.log));
		t.pass();
		clearMock();
	} catch (error) {
		clearMock();
		t.fail(error);
	}
});

test('main module should listen to options', async t => {
	try {
		await main(new LoggerMock(t.log), {dryrun: true, exportConfig: true, verbose: true});
		t.pass();
		clearMock();
	} catch (error) {
		clearMock();
		t.fail(error);
	}
});

test('main module should initiate import when provided option is true', async t => {
	try {
		await main(new LoggerMock(t.log), {importConfig: true});
		t.pass();
		clearMock();
	} catch (error) {
		clearMock();
		t.fail(error);
	}
});

test('main module should prohibit import and export flags at the same time', async t => {
	try {
		const logger = new LoggerMock(t.log);
		await main(logger, {dryrun: false, exportConfig: true, importConfig: true, verbose: false});

		const error = logger.logs.find(log => log.type === 'error');
		t.truthy(error, 'In the logger instance there should be an "error" log line');
		// Search for an argument of type string: that argument is the message of the log line
		for (const arg of error.args) {
			if (typeof arg === 'string') {
				t.regex(arg, /.*both import.*export/);
			}
		}

		clearMock();
	} catch (error) {
		t.fail(error);
		clearMock();
	}
});

function clearMock() {
	mock.stop(promptModule);
	mock.stop(configSetterModule);
	mock.stop(importModule);
}

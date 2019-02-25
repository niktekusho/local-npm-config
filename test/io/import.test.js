import test from 'ava';

const http = require('http');
const {writeFileSync, unlinkSync} = require('fs');

const getPort = require('get-port');
const tempy = require('tempy');

class Log {
	constructor() {
		this.ops = [];
	}

	debug(msg) {
		this.ops.push({type: 'debug', msg});
	}

	info(msg) {
		this.ops.push({type: 'info', msg});
	}
}

const importFn = require('../../src/io/import');

test.before(async t => {
	const fixedResponseObj = {
		author: {
			name: 'test',
			email: 'test@test.test'
		},
		license: 'MIT',
		version: '0.1.0'
	};
	const fixedResponseString = JSON.stringify(fixedResponseObj);
	const server = await setupServer(fixedResponseString);
	t.context.server = server;
	t.context.port = server.address().port;
});

test.after.always('cleanup', t => {
	if (t.context.server) {
		t.context.server.close();
	}
});

async function setupServer(fixedResponse) {
	const server = http.createServer((req, res) => {
		// Always return the fixed response (no matter what method we use)
		res.setHeader('Content-Type', 'application/json');
		res.write(fixedResponse);
		res.end();
	});

	const port = await getPort();

	server.listen(port);

	return server;
}

test('should throw if the path argument is null', async t => {
	try {
		await importFn(null, null, false);
		t.fail('Null path should throw!');
	} catch (error) {
		t.is(error.message, 'Path should be specified!');
	}
});

test('should throw if the path argument is undefined', async t => {
	try {
		await importFn(undefined, null, false);
		t.fail('Undefined path should throw!');
	} catch (error) {
		t.is(error.message, 'Path should be specified!');
	}
});

test('should read the file specified in the argument', async t => {
	// Setup
	const tempFile = tempy.file({extension: 'json'});
	const tempConfig = '{"test":"foo"}';
	const logger = new Log();
	writeFileSync(tempFile, tempConfig);

	const config = await importFn(tempFile, logger, false);
	t.true(typeof config === 'object');
	t.deepEqual(config, {test: 'foo'});

	// Teardown
	unlinkSync(tempFile);
});

test('passing a path to a non JSON file should throw', async t => {
	// Setup
	const tempFile = tempy.file();
	const tempConfig = '{"test":"foo"}';
	const logger = new Log();
	writeFileSync(tempFile, tempConfig);

	await t.throwsAsync(importFn(tempFile, logger, false));

	// Teardown
	unlinkSync(tempFile);
});

test('passing a path to a .json file which is not parseable should throw', async t => {
	// Setup
	const tempFile = tempy.file({extension: 'json'});
	const tempConfig = '{"test"}';
	const logger = new Log();
	writeFileSync(tempFile, tempConfig);

	await t.throwsAsync(importFn(tempFile, logger, false));

	// Teardown
	unlinkSync(tempFile);
});

test('passing a dryRun option should write the file content and target path in console', async t => {
	// Setup
	const tempFile = tempy.file({extension: 'json'});
	const tempConfig = '{"test":"foo"}';
	const logger = new Log();
	writeFileSync(tempFile, tempConfig);

	const res = await importFn(tempFile, logger, true);

	// Function should still read and return the file as an object
	t.false(res === undefined || res === null);

	// We should have 2 log.infos
	t.is(logger.ops.filter(op => op.type === 'info').length, 2);

	// Teardown
	unlinkSync(tempFile);
});

test('passing an HTTP url as path argument should initiate download', async t => {
	// Server is created in the before hook
	const {port} = t.context;
	const fakeUrl = `http://localhost:${port}/fake_data.json`;
	const logger = new Log();
	const res = await importFn(fakeUrl, logger, false);
	t.log(res);
	t.truthy(res);
});

test('passing an HTTP url as path argument should initiate download and return the object even when dryrun is true', async t => {
	// Server is created in the before hook
	const {port} = t.context;
	const fakeUrl = `http://localhost:${port}/fake_data.json`;
	const logger = new Log();
	const res = await importFn(fakeUrl, logger, true);
	t.log(res);
	t.truthy(res);
});

test('passing a url without protocol as path argument should first go through the local path and then fall back to the remote one (http)', async t => {
	const {port} = t.context;
	const fakeUrl = `localhost:${port}/fake_data.json`;
	const logger = new Log();
	const res = await importFn(fakeUrl, logger, false);
	t.log(res);
	t.truthy(res);
});

test('passing a url without protocol as path argument should first go through the local path and then fall back to the remote one (https)', async t => {
	const apiUrl = 'randomuser.me/api/?results=1';
	const logger = new Log();
	const res = await importFn(apiUrl, logger, false);
	t.log(res);
	t.truthy(res);
});

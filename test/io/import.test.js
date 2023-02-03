const {test, before, teardown} = require('tap');
const http = require('http');
const {writeFileSync, unlinkSync} = require('fs');

const {getPort} = require('get-port-please');
const tempy = require('tempy');

const {Log} = require('../_utils');
const importFn = require('../../src/io/import');

let server = null;
let port = null;

before(async () => {
	const fixedResponseObj = {
		author: {
			name: 'test',
			email: 'test@test.test'
		},
		license: 'MIT',
		version: '0.1.0'
	};
	const fixedResponseString = JSON.stringify(fixedResponseObj);
	server = await setupServer(fixedResponseString);
	port = server.address().port;
});

teardown(() => {
	// eslint-disable-next-line no-eq-null, eqeqeq
	if (server != null) {
		server.close();
		server = null;
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
	await t.rejects(() => importFn(null, null), new Error('Path should be specified!'));
});

test('should throw if the path argument is undefined', async t => {
	await t.rejects(() => importFn(undefined, null), new Error('Path should be specified!'));
});

test('should read the file specified in the argument', async t => {
	// Setup
	const tempFile = tempy.file({extension: 'json'});
	const tempConfig = '{"test":"foo"}';
	const logger = new Log();
	writeFileSync(tempFile, tempConfig);

	const config = await importFn(tempFile, logger);
	t.ok(typeof config === 'object');
	t.strictSame(config, {test: 'foo'});

	// Teardown
	unlinkSync(tempFile);
});

test('passing a path to a file without the json extension should throw', async t => {
	// Setup
	const tempFile = tempy.file();
	const tempConfig = '{"test":"foo"}';
	const logger = new Log();
	writeFileSync(tempFile, tempConfig);

	await t.rejects(() => importFn(tempFile, logger), `File with path ${tempFile} is not a JSON file.`);

	// Teardown
	unlinkSync(tempFile);
});

test('passing a path to a .json file which is not parseable should throw', async t => {
	// Setup
	const tempFile = tempy.file({extension: 'json'});
	const tempConfig = '{"test"}';
	const logger = new Log();
	writeFileSync(tempFile, tempConfig);

	await t.rejects(() => importFn(tempFile, logger), `File with path ${tempFile} is not a JSON file.`);

	// Teardown
	unlinkSync(tempFile);
});

test('passing an HTTP url as path argument should initiate download', async t => {
	// Server is created in the before hook
	const fakeUrl = `http://localhost:${port}/fake_data.json`;
	const logger = new Log();
	const res = await importFn(fakeUrl, logger);
	t.ok(res);
});

test('passing a url without protocol as path argument should first go through the local path and then fall back to the remote one (http)', async t => {
	const fakeUrl = `localhost:${port}/fake_data.json`;
	const logger = new Log();
	const res = await importFn(fakeUrl, logger);
	t.ok(res);
});

test('passing a url without protocol as path argument should first go through the local path and then fall back to the remote one (https)', async t => {
	const apiUrl = 'randomuser.me/api/?results=1';
	const logger = new Log();
	const res = await importFn(apiUrl, logger);
	t.ok(res);
});

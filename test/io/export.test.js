import test from 'ava';

const mock = require('mock-require');

class FSOperation {
	constructor(path, data) {
		this.path = path;
		this.data = data;
	}
}

mock('fs', {
	writeFile(path, data, opts, cb) {
		cb(null, new FSOperation(path, data));
	}
});

const {ConfigExample} = require('../_utils');

const exporter = require('../../src/io/export');

test('passing object should write the file in the current cwd', async t => {
	const config = new ConfigExample('test');
	const {data, path} = await exporter(config);
	t.true(typeof data === 'string' && data.length > 0);
	t.regex(path, /^.*local-npm-config\.json$/);
});

test('passing string should write the file in the current cwd', async t => {
	const {data, path} = await exporter('test');
	t.is(data, 'test');
	t.regex(path, /^.*local-npm-config\.json$/);
});

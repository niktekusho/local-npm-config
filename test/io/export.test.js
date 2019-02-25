import test from 'ava';

const mock = require('mock-require');

class FSOperation {
	constructor(path, data) {
		this.path = path;
		this.data = data;
	}
}

class Log {
	constructor() {
		this.ops = [];
	}

	info(msg) {
		this.ops.push(msg);
	}
}

mock('fs', {
	writeFile(path, data, opts, cb) {
		cb(null, new FSOperation(path, data));
	}
});

const logger = new Log();

const {ConfigExample} = require('../_utils');

const exporter = require('../../src/io/export');

test('passing object should write the file in the current cwd', async t => {
	const config = new ConfigExample('test');
	const {data, path} = await exporter(config, undefined, false);
	t.true(typeof data === 'string' && data.length > 0);
	t.regex(path, /^.*local-npm-config\.json$/);
});

test('passing string should write the file in the current cwd', async t => {
	const {data, path} = await exporter('test', undefined, false);
	t.is(data, 'test');
	t.regex(path, /^.*local-npm-config\.json$/);
});

test('passing a dryRun option should write the file content and target path in console', async t => {
	const res = await exporter('{"test":"foo"}', logger, true);
	t.is(res, undefined);
	// 2 log operations
	t.is(logger.ops.length, 2);
	// 1st: config object is printed
	t.regex(logger.ops[0], /.*\{"test":"foo"\}$/);
	// 2nd: config export path is printed
	t.regex(logger.ops[1], /^.*local-npm-config\.json$/);
});

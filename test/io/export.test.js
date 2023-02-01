const {test} = require('tap');
const mock = require('mock-require');

const {FSOperation, Log} = require('../_utils');

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
	t.ok(typeof data === 'string' && data.length > 0);
	t.match(path, /^.*local-npm-config\.json$/);
});

test('passing string should write the file in the current cwd', async t => {
	const {data, path} = await exporter('test', undefined, false);
	t.ok(data, 'test');
	t.match(path, /^.*local-npm-config\.json$/);
});

test('passing a dryRun option should write the file content and target path in console', async t => {
	const res = await exporter('{"test":"foo"}', logger, true);
	t.same(res, undefined);
	// 2 log operations
	t.ok(logger.logs.length, 2);
	// 1st: config object is printed
	t.match(logger.logs[0].args[0], /.*\{"test":"foo"\}$/);
	// 2nd: config export path is printed
	t.match(logger.logs[1].args[0], /^.*local-npm-config\.json$/);
});

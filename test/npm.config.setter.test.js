const {test} = require('tap');
const mock = require('mock-require');

class ExecaMock {
	constructor() {
		this._ops = [];
		this._return = (stdout, stderr) => ({stdout, stderr});
	}

	sync(...args) {
		const opType = 'sync';
		this._ops.push({type: opType, args});
		return this._return(opType, opType);
	}

	clear() {
		this._ops.splice(0);
	}

	get ops() {
		return this._ops;
	}

	get first() {
		return this._ops.length > 0 ? this._ops[0] : undefined;
	}
}

const execaMock = new ExecaMock();

mock('execa', execaMock);

const setter = require('../src/npm.config.setter');
const {Log} = require('./_utils');

test('setter should call execa with "npm set config value"', async t => {
	const mockedLogger = new Log();
	execaMock.clear();
	setter('testConfig', 'testValue', mockedLogger);
	const cmd = execaMock.first;
	t.ok(cmd);
	t.equal(cmd.args[0], 'npm');
	t.strictSame(cmd.args[1], ['set', 'testConfig=testValue', '--location=user']);
});

test('setter should not call execa when dryrun option is true', async t => {
	const mockedLogger = new Log();
	execaMock.clear();
	setter('testConfig', 'testValue', mockedLogger, true);
	const cmd = execaMock.first;
	t.equal(cmd, undefined);
	t.ok(mockedLogger.infos.length > 0);
});

const {test} = require('tap');

const proxyquireStrict = require('proxyquire')
	// Disable original module call
	.noCallThru();

const {Log} = require('./_utils');

const answers = {
	author: {
		name: 'test',
		email: 'test@t.t',
		url: ''
	},
	license: 'MIT',
	version: '0.0.1'
};

const promptStub = async () => answers;

test('main module with the export flag should call the export module', async t => {
	const mainStub = {
		'./prompt': promptStub,
		'./io': {
			exportConfig: async config => {
				const expectedConfig = {
					author: {
						name: 'test',
						email: 'test@t.t'
					},
					license: 'MIT',
					version: '0.0.1'
				};
				t.same(config, expectedConfig);
			}
		}
	};

	const main = proxyquireStrict('../src/index', mainStub);

	await main(new Log(), {dryrun: true, exportConfig: true, verbose: true});
});

test('main module should initiate import when provided option is truthy', async t => {
	const mainStub = {
		'./io': {
			importConfig: async pathToConfig => {
				t.same(pathToConfig, 'local-path-to-config.json');
			}
		},
		'./utils/object.minimizer': () => t.pass('minimizer was called'),
		'./utils/config.transformer': () => t.pass('transform was called'),
		'./npm.config.setter': () => t.pass('npm config was called')
	};

	const main = proxyquireStrict('../src/index', mainStub);

	await main(new Log(), {importConfig: 'local-path-to-config.json'});
});

test('main module should prohibit import and export flags at the same time', async t => {
	const mainStub = {};

	const main = proxyquireStrict('../src/index', mainStub);

	const logger = new Log();
	await main(logger, {dryrun: false, exportConfig: true, importConfig: true, verbose: false});

	const error = logger.logs.find(log => log.type === 'error');
	t.ok(error, 'In the logger instance there should be an "error" log line');
	// Search for an argument of type string: that argument is the message of the log line
	for (const arg of error.args) {
		if (typeof arg === 'string') {
			t.match(arg, /.*both import.*export/);
		}
	}
});

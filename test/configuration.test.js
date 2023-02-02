const {test} = require('tap');
const Configuration = require('../src/configuration');

test('new Configuration should create expected object', async t => {
	const config = new Configuration('a.key', 'value');

	t.same(config, {key: 'a-key', value: 'value'});
});

test('Configuration.initConfig should create expected object', async t => {
	const config = Configuration.initConfig('a.key', 'value');

	t.same(config, {key: 'init-a-key', value: 'value'});
});

const {test} = require('tap');
const transformer = require('../../src/utils/config.transformer');

const answers = {
	author: {
		name: 'test',
		email: 'test@t.t',
		url: ''
	},
	license: 'MIT',
	version: '0.0.1'
};

test('config.transformer should return an array of transformed config', async t => {
	const transformed = transformer(answers);
	t.strictSame(transformed[0], {config: 'author-name', value: 'test'});
	t.strictSame(transformed[1], {config: 'author-email', value: 'test@t.t'});
	t.strictSame(transformed[2], {config: 'license', value: 'MIT'});
	t.strictSame(transformed[3], {config: 'version', value: '0.0.1'});
});

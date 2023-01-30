import test from 'ava';

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

test('config.transformer should return an array of transformed config', t => {
	const transformed = transformer(answers);
	t.deepEqual(transformed[0], {config: 'author-name', value: 'test'});
	t.deepEqual(transformed[1], {config: 'author-email', value: 'test@t.t'});
	t.deepEqual(transformed[2], {config: 'license', value: 'MIT'});
	t.deepEqual(transformed[3], {config: 'version', value: '0.0.1'});
});

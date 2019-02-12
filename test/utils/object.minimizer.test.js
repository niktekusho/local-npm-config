import test from 'ava';

const minimize = require('../../src/utils/object.minimizer');

const answers = {
	author: {
		name: 'test',
		email: undefined,
		url: false
	},
	license: 'MIT',
	version: ''
};

test('object.minimize should return the minimized object', t => {
	const minimized = minimize(answers);
	t.deepEqual(minimized, {author: {name: 'test'}, license: 'MIT'});
});

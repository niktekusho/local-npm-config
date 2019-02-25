import test from 'ava';

const minimize = require('../../src/utils/object.minimizer');

test('object.minimizer should return the object without falsy values', t => {
	const minimized = minimize({
		author: {
			name: 'test',
			email: 'test@t.t',
			url: ''
		},
		license: 'MIT',
		version: '0.0.1'
	});
	t.deepEqual(minimized, {
		author: {name: 'test', email: 'test@t.t'}, license: 'MIT', version: '0.0.1'
	});
});

test('minimize should return the minimum object', t => {
	// Minimal
	const minimal = minimize({
		author: {
			name: 'test',
			email: '',
			url: ''
		},
		license: '',
		version: ''
	});
	t.deepEqual(minimal, {author: {name: 'test'}});
});

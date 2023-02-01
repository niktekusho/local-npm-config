const {test} = require('tap');
const minimize = require('../../src/utils/object.minimizer');

test('object.minimizer should return the object without falsy values', async t => {
	const minimized = minimize({
		author: {
			name: 'test',
			email: 'test@t.t',
			url: ''
		},
		license: 'MIT',
		version: '0.0.1'
	});
	t.strictSame(minimized, {
		author: {name: 'test', email: 'test@t.t'}, license: 'MIT', version: '0.0.1'
	});
});

test('minimize should return the minimum object', async t => {
	const minimal = minimize({
		author: {
			name: 'test',
			email: '',
			url: ''
		},
		license: '',
		version: ''
	});
	t.strictSame(minimal, {author: {name: 'test'}});
});

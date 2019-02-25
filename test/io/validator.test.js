import test from 'ava';

const {ConfigExample} = require('../_utils');

const validate = require('../../src/io/validator');

// Quick test to see if everything works... Ajv should not be tested!
test('should return true with a valid object', t => {
	const example = new ConfigExample('test');
	const result = validate(example);
	t.true(result.isValid);
	t.deepEqual(result.errors, null);
});

test('if argument is a string it should parse it to a JSON object', t => {
	const example = new ConfigExample('test');
	const result = validate(JSON.stringify(example));
	t.true(result.isValid);
	t.deepEqual(result.errors, null);
});

test('if argument is a string but is not parseable to a JSON object it should throw', t => {
	t.throws(() => validate(''));
});

test('validate should NOT throw when passing falsy values (null, false, undefined, 0, etc.)', t => {
	t.false(validate(null).isValid);
	t.false(validate().isValid);
	t.false(validate(false).isValid);
	t.false(validate(0).isValid);
});

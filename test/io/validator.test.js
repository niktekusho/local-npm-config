const {test} = require('tap');
const {ConfigExample} = require('../_utils');

const validate = require('../../src/io/validator');

// Quick test to see if everything works... Ajv should not be tested!
test('should return true with a valid object', async t => {
	const example = new ConfigExample('test');
	const result = validate(example);
	t.ok(result.isValid);
	t.equal(result.errors, null);
});

test('if argument is a string it should parse it to a JSON object', async t => {
	const example = new ConfigExample('test');
	const result = validate(JSON.stringify(example));
	t.ok(result.isValid);
	t.equal(result.errors, null);
});

test('if argument is a string but is not parseable to a JSON object it should throw', async t => {
	t.throws(() => validate(''));
});

test('validate should NOT throw when passing falsy values (null, false, undefined, 0, etc.)', async t => {
	t.notOk(validate(null).isValid);
	t.notOk(validate().isValid);
	t.notOk(validate(false).isValid);
	t.notOk(validate(0).isValid);
});

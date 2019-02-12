const Ajv = require('ajv');

const jsonSchema = require('./config.schema.json');

const ajv = new Ajv({
	allErrors: true
});

const rawValidate = ajv.compile(jsonSchema);

function wrappedValidate(arg) {
	let toValidate = arg || {};
	if (typeof arg === 'string') {
		try {
			toValidate = JSON.parse(arg);
		} catch (error) {
			throw new TypeError('Could not parse specified string into a JSON object');
		}
	}

	return rawValidate(toValidate);
}

module.exports = wrappedValidate;


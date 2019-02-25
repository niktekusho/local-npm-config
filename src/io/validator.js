const Ajv = require('ajv');

const jsonSchema = require('./config.schema.json');

const ajv = new Ajv({
	allErrors: true
});

const rawValidate = ajv.compile(jsonSchema);

class ValidationResult {
	constructor(isValid, errors) {
		this._isValid = isValid;
		this._errors = errors;
	}

	get isValid() {
		return this._isValid;
	}

	get errors() {
		return this._errors;
	}
}

function wrappedValidate(arg) {
	let toValidate = arg || {};
	if (typeof arg === 'string') {
		try {
			toValidate = JSON.parse(arg);
		} catch (error) {
			throw new TypeError('Could not parse specified string into a JSON object');
		}
	}

	const isValid = rawValidate(toValidate);
	return new ValidationResult(isValid, rawValidate.errors);
}

module.exports = wrappedValidate;


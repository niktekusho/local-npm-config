const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const jsonSchema = require('./config.schema.json');

const ajv = new Ajv({
	allErrors: true
});
addFormats(ajv);

const rawValidate = ajv.compile(jsonSchema);

/**
 * Wraps the result of the validation process.
 */
class ValidationResult {
	/**
	 * Create the result of the validation.
	 *
	 * @param {bool} isValid `true` if the object complied the validation.
	 * @param {Ajv.ErrorObject[]?} errors Errors returned from Ajv if the object wasn't valid.
	 */
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

/**
 * Run validation against the specified target.
 *
 * @param {object|string} arg Object to validate. If a string is passed, it will be parsed with {JSON.parse}.
 * @returns {ValidationResult} Result of the validation.
 */
function wrappedValidate(arg) {
	let toValidate = arg || {};
	if (typeof arg === 'string') {
		try {
			toValidate = JSON.parse(arg);
		} catch (error) {
			throw new TypeError('Could not parse specified string into a JSON object', error);
		}
	}

	const isValid = rawValidate(toValidate);
	return new ValidationResult(isValid, rawValidate.errors);
}

module.exports = wrappedValidate;


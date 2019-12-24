const {URL} = require('url');

function validateUrl(url) {
	try {
		// eslint-disable-next-line no-new
		new URL(url);
		return true;
	} catch (_) {
		return `${url} is not a valid Url.`;
	}
}

module.exports = {
	type: 'input',
	name: 'author.url',
	message: 'What is the url you want to set in the npm config?',
	// Validate the url only if the user inserted it
	validate: url => url ? validateUrl(url) : true
};

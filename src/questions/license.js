const licenses = require('spdx-license-list');
const Fuse = require('fuse.js');

const licensesAsChoices = Object.keys(licenses)
	.map(licenseId => ({name: licenses[licenseId].name, value: licenseId}));

const choices = [{name: 'Leave unset...', value: ''}, ...licensesAsChoices];

async function searchLicense(answers, input) {
	// Only filter if input is defined
	if (input) {
		// Use fuse to "fuzzy search" for the correct choice
		// Fuse will run the search on both the name and the value properties of the licenses
		const fuse = new Fuse(licensesAsChoices, {keys: ['name', 'value']});
		return fuse.search(input);
	}

	return choices;
}

module.exports = {
	type: 'autocomplete',
	name: 'license',
	message: 'What default license do you want to set in the npm config?',
	source: searchLicense
};

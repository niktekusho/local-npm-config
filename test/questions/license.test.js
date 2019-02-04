import test from 'ava';

const licenses = require('spdx-license-list');

const {source} = require('../../src/questions/license');

const licensesLength = Object.keys(licenses).length;

test('source should return all licenses when no filter specified', async t => {
	// The "Leave unset" option is there...
	const srcLicences = await source(null, null);
	t.is(srcLicences.length, licensesLength + 1);
});

test('source should return some licenses when a filter is specified', async t => {
	const srcLicences = await source(null, 'mit license');
	t.true(srcLicences.length < (licensesLength + 1));
});

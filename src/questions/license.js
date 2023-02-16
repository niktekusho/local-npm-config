const licenses = require('spdx-license-list')
const Fuse = require('fuse.js')

const licensesAsChoices = Object.keys(licenses)
  .map(licenseId => ({ name: licenses[licenseId].name, value: licenseId }))

const choices = [{ name: 'Leave unset...', value: '' }, ...licensesAsChoices]

/**
 * @typedef {typeof import("spdx-license-list")} Licenses
 */

/**
 * @type {import("fuse.js").default.IFuseOptions<Licenses>}
 */
const fuseOpts = {
  keys: ['name', 'value']
}

// Use fuse to "fuzzy search" for the correct choice
// Fuse will run the search on both the name and the value properties of the licenses
/**
 * @type {import("fuse.js").default<Licenses>}
 */
const fuse = new Fuse(licensesAsChoices, fuseOpts)

/**
 * Returns the appropriate licenses, filtered if the user supplied a filter.
 *
 * @param {string?} input Input license.
 * @returns {Licenses} Licenses to display to the user, optionally filtered.
 */
async function getLicenses (_, input) {
  // Only filter if input is defined
  if (input) {
    const result = fuse.search(input)
    return result.map(res => res.item)
  }

  return choices
}

module.exports = {
  type: 'autocomplete',
  name: 'license',
  message: 'What default license do you want to set in the npm config?',
  source: getLicenses
}

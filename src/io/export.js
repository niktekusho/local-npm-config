const {writeFile} = require('fs');
const {promisify} = require('util');
const {join} = require('path');

const asyncWriteFile = promisify(writeFile);

async function exportConfig(config) {
	const path = join(process.cwd(), 'local-npm-config.json');
	let toExport = config;
	if (typeof toExport === 'object') {
		toExport = JSON.stringify(config, null, '  ');
	}

	return asyncWriteFile(path, toExport, {encoding: 'utf8'});
}

module.exports = exportConfig;

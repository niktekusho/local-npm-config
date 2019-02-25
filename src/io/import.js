const {readFile} = require('fs');
const {basename} = require('path');
const {promisify} = require('util');

const download = require('download');
const prependCwd = require('prepend-cwd');

const asyncReadFile = promisify(readFile);

async function importFn(path, logger, dryRun) {
	if (path === null || path === undefined) {
		throw new Error('Path should be specified!');
	}

	logger.debug(`Import: ${path}`);

	// Very naive way... (http and https)
	if (path.startsWith('http')) {
		logger.debug('Import from remote location');
		// Directly go with the importRemote
		return importRemote(path, logger, dryRun);
	}

	// Local first when the path is dubious
	try {
		logger.debug('Local first when in doubt!');
		const local = await importLocal(path, logger, dryRun);
		return local;
	} catch (error) {
		logger.debug(`Error caught: ${error.message}`);
		// Might be http or https: by default download will append https via prepend-http
		try {
			const remoteHttp = await importRemote(path, logger, dryRun);
			return remoteHttp;
		} catch (remoteError) {
			logger.debug(remoteError);
			// Manually prepend http in case https failed
			return importRemote(`http://${path}`, logger, dryRun);
		}
	}
}

async function importRemote(path, logger, dryRun) {
	if (dryRun) {
		logger.info(`Downloading file from: ${path}`);
	}

	const content = await download(path);
	logger.debug(content);

	return parseContent(content, logger, dryRun);
}

function parseContent(fileContent, logger, dryRun) {
	logger.debug(fileContent);

	let parsedJSON = {};
	try {
		parsedJSON = JSON.parse(fileContent);
	} catch (error) {
		throw new Error(`Could not parse content: ${fileContent}`);
	}

	if (dryRun) {
		logger.info(`Parsed content: ${fileContent}`);
	}

	return parsedJSON;
}

async function importLocal(path, logger, dryRun) {
	const toFile = prependCwd(path);
	logger.debug(`${path} -> ${toFile}`);

	if (basename(toFile).endsWith('.json')) {
		if (dryRun) {
			logger.info(`Reading content from: ${toFile}`);
		}

		const fileContent = await asyncReadFile(toFile, {encoding: 'utf8'});

		return parseContent(fileContent, logger, dryRun);
	}

	throw new TypeError(`File with path ${toFile} is not a JSON file.`);
}

module.exports = importFn;

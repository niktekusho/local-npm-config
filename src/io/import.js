const {readFile} = require('fs');
const {basename} = require('path');
const {promisify} = require('util');

const download = require('download');
const prependCwd = require('prepend-cwd');

const asyncReadFile = promisify(readFile);

/**
 * @typedef { import("../types").Logger } Logger
 */

/**
 * Imports the npm configuration backup from a local file or a remote resource.
 *
 * @param {string} path Path to the configuration backup.
 * @param {Logger} logger Logger instance.
 * @param {bool} dryRun `true` if the user only wants to print the expected operations and not execute them.
 * @returns {object} Configuration to import.
 */
async function importFn(path, logger, dryRun) {
	if (path === null || path === undefined) {
		throw new Error('Path should be specified!');
	}

	logger.debug(`importFn: ${path}`);

	// Very naive way... (http and https)
	if (path.startsWith('http')) {
		logger.debug('importFn: Import from remote location');
		// Directly go with the importRemote
		return importRemote(path, logger, dryRun);
	}

	// Local first when the path is dubious
	try {
		logger.debug('importFn: Local first when in doubt!');
		const local = await importLocal(path, logger, dryRun);
		return local;
	} catch (error) {
		logger.debug(`importFn: Error caught: ${error.message}`);
		// Might be http or https: by default download will append https via prepend-http
		try {
			const remoteHttp = await importRemote(path, logger, dryRun);
			return remoteHttp;
		} catch (remoteError) {
			logger.debug(`importFn: ${remoteError}`);
			// Manually prepend http in case https failed
			return importRemote(`http://${path}`, logger, dryRun);
		}
	}
}

/**
 * Imports the npm configuration backup from a remote URL.
 *
 * @param {string} path Path to the configuration backup.
 * @param {Logger} logger Logger instance.
 * @param {bool} dryRun `true` if the user only wants to print the expected operations and not execute them.
 * @returns {object} Configuration to import.
 */
async function importRemote(path, logger, dryRun) {
	if (dryRun) {
		logger.info(`Downloading file from: ${path}`);
	}

	const content = await download(path);
	logger.debug(`importRemote: ${content.toString('utf8')}`);

	return parseContent(content, logger);
}

/**
 * Parse the configuration backup into an object.
 *
 * @param {string} fileContent File content.
 * @param {Logger} logger Logger instance.
 * @returns {object} Configuration to import.
 */
function parseContent(fileContent, logger) {
	let parsedJSON = {};
	try {
		parsedJSON = JSON.parse(fileContent);
	} catch (error) {
		throw new Error(`Could not parse content: ${fileContent}`, error);
	}

	logger.info(`Parsed content: ${fileContent}`);

	return parsedJSON;
}

/**
 * Imports the npm configuration backup from a local file.
 *
 * @param {string} path Path to the configuration backup.
 * @param {Logger} logger Logger instance.
 * @param {bool} dryRun `true` if the user only wants to print the expected operations and not execute them.
 * @returns {object} Configuration to import.
 */
async function importLocal(path, logger, dryRun) {
	const toFile = prependCwd(path);
	logger.debug(`importLocal: ${path} -> ${toFile}`);

	if (basename(toFile).endsWith('.json')) {
		if (dryRun) {
			logger.info(`Reading content from: ${toFile}`);
		}

		const fileContent = await asyncReadFile(toFile, {encoding: 'utf8'});

		return parseContent(fileContent, logger);
	}

	throw new TypeError(`File with path ${toFile} is not a JSON file.`);
}

module.exports = importFn;

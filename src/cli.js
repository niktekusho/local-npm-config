#!/usr/bin/env node

const meow = require('meow');

const loggerFactory = require('./logger');
const main = require('.');

const cli = meow(`
Usage:
$ local-npm-config

Options:
	  --verbose        Display debug info.
`, {
	flags: {
		verbose: {
			type: 'boolean',
			default: false
		}
	}
});

const logger = loggerFactory(cli.flags.verbose);

main(logger)
	.then(() => logger.success('Successfully configured npm!'))
	.catch(error => logger.error(`Unexpected error: ${error.message}`));

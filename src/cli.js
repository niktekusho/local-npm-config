#!/usr/bin/env node

const meow = require('meow');

const meowShortcuts = require('meow-shorts');

const loggerFactory = require('./utils/logger');
const main = require('.');

const cli = meow(`
Usage:
$ local-npm-config

Options:
  --dryrun,          List which commands will be launched instead of running them.
   -d

  --export-config,   Export your configuration into a json file in your current working directory.
   -e

  --verbose          Display debug info.

`, {
	flags: {
		dryrun: {
			type: 'boolean',
			default: false,
			alias: 'd'
		},
		exportConfig: {
			type: 'boolean',
			default: false,
			alias: 'e'
		},
		verbose: {
			type: 'boolean',
			default: false
		}
	}
});

meowShortcuts(cli);

const logger = loggerFactory(cli.flags.verbose);
const options = cli.flags;

main(logger, options)
	.then(() => {
		if (options.dryrun) {
			logger.note('Above you can see which commands would have been run with your input.');
		} else {
			logger.success('Successfully configured npm! Thank you for using this script!');
		}
	}).catch(error => logger.error(`Unexpected error: ${error.message}`));

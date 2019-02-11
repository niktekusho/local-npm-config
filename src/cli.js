#!/usr/bin/env node

const meow = require('meow');

const meowShortcuts = require('meow-shorts');

const loggerFactory = require('./logger');
const main = require('.');

const cli = meow(`
Usage:
$ local-npm-config

Options:
  --dryrun,   List which commands will be launched instead of running them.
   -d

  --verbose   Display debug info.

`, {
	flags: {
		dryrun: {
			type: 'boolean',
			default: false,
			alias: 'd'
		},
		verbose: {
			type: 'boolean',
			default: false
		}
	}
});

meowShortcuts(cli);

const logger = loggerFactory(cli.flags.verbose);
const {dryrun} = cli.flags;

if (cli.flags.verbose) {
	logger.info('Verbose mode enabled');
}

if (dryrun) {
	logger.info('Dryrun mode enabled');
}

main(logger, dryrun)
	.then(() => {
		if (dryrun) {
			logger.note('Above you can see which commands would have been run with your input.');
		} else {
			logger.success('Successfully configured npm! Thank you for using this script!');
		}
	}).catch(error => logger.error(`Unexpected error: ${error.message}`));

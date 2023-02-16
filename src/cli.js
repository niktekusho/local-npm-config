#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const loggerFactory = require('./utils/logger')
const main = require('.')

const options = yargs(hideBin(process.argv))
  .strict()
  .usage('local-npm-config - Exports your current npm config to a JSON file.')
  .usage('local-npm-config -i <path_to_json> - Imports the specified JSON into npm config.')
  .option('export-config', {
    alias: 'e',
    boolean: true,
    describe: 'Export your configuration into a json file in your current working directory.'
  })
  .option('import-config', {
    alias: 'i',
    describe: 'Apply the npm configuration from a config file (local or remote).\nThis option will overwrite previous values!',
    requiresArg: true,
    type: 'string'
  })
  .option('dryrun', {
    alias: 'd',
    boolean: true,
    describe: 'List which commands will be launched instead of running them.'
  })
  .option('verbose', {
    boolean: true,
    default: false,
    describe: 'Display debug info.'
  })
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .parseSync()

const logger = loggerFactory(options.verbose)

main(logger, options)
  .then(() => {
    if (options.dryrun) {
      logger.note('Above you can see which commands would have been run with your input.')
    } else {
      logger.success('Successfully configured npm! Thank you for using this script!')
    }
  }).catch(error => logger.error(`Unexpected error: ${error.message}`))

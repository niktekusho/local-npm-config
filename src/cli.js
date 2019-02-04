#!/usr/bin/env node

const main = require('.');

main()
	.then(() => console.log('Successfully configured npm!'))
	.catch(error => console.error(`Unexpected error: ${error.message}`));

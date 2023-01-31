import test from 'ava';

const {spawnSync} = require('child_process');
const {copyFileSync, readFileSync, rmSync} = require('fs');
const {join, resolve} = require('path');
const {homedir} = require('os');

process.on('uncaughtException', err => {
	console.log('Caught exception: ' + err);
	process.exit(1000);
});

const home = homedir();

const npmRcPath = join(home, '.npmrc');
const npmRcBackupPath = join(home, '.npmrc.backup');
const rootProjectDirPath = resolve(__dirname, '..');

let backedUpExistingNpmrc = false;

// eslint-disable-next-line func-names
test.before(function setup() {
	try {
		// If backup creation fails, ignore silently
		copyFileSync(npmRcPath, npmRcBackupPath);

		backedUpExistingNpmrc = true;

		// Removes the existing .npmrc to prevent issues with "old" keys remaining in the file.
		rmSync(npmRcPath);
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.log(`File ${npmRcPath} does not exist?`);
		} else {
			console.log(error);
			console.log(readFileSync(npmRcBackupPath, 'utf-8'));
		}
	}
});

// eslint-disable-next-line func-names
test.after.always(function restoreBackup() {
	if (backedUpExistingNpmrc) {
		console.log('Restoring .npmrc backup');
		try {
			copyFileSync(npmRcBackupPath, npmRcPath);
		} catch (error) {
			console.log(error);
			console.log(`Automated .npmrc backup restore failed. You'll need to restore it manually [file at ${npmRcBackupPath}]`);
		}
	}
});

test.serial('running CLI with the import function should create the appropriate .npmrc in the home dir', t => {
	const script = join(rootProjectDirPath, 'src', 'cli.js');
	const command = `node ${script} -i test/integration.test.sample.json --verbose`;
	t.log(`Will launch the following command: ${command}`);

	spawnSync('node',
		[script, '-i', 'test/integration.test.sample.json', '--verbose'],
		{stdio: 'inherit'});

	let npmRcFile = readFileSync(npmRcPath, {encoding: 'utf-8'});
	// Fix for tests running on windows
	npmRcFile = npmRcFile.replace(/\r\n/g, '\n');
	t.log(npmRcFile);
	t.is(npmRcFile, `init-author-name=integration tester
init-author-email=integration-tester@example.org
init-author-url=https://integration-tester.org/
init-license=MIT
init-version=1.0.0
`);
});

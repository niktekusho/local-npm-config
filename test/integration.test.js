import test from 'ava';

const execa = require('execa');
const {copyFileSync, readFileSync, rmSync} = require('fs');
const {join, resolve} = require('path');
const {homedir} = require('os');

const home = homedir();

const npmRcPath = join(home, '.npmrc');
const npmRcBackupPath = join(home, '.npmrc.backup');

// eslint-disable-next-line func-names
test.before(function setup() {
	console.log('Installing package globally');
	const result = execa.commandSync('npm link', {
		cwd: resolve(__dirname, '..')
	});
	console.log(result.command);

	try {
		// If backup creation fails, fail the test early?
		copyFileSync(npmRcPath, npmRcBackupPath);
		// Removes the existing .npmrc
		rmSync(npmRcPath);
	} catch (error) {
		if (error.code !== 'ENOENT') {
			console.error(error);
		}
	}
});

// eslint-disable-next-line func-names
test.after.always(function restoreBackup() {
	console.log('Restoring .npmrc backup');
	execa.commandSync('npm unlink .', {
		cwd: resolve(__dirname, '..')
	});
	try {
		copyFileSync(npmRcBackupPath, npmRcPath);
	} catch (error) {
		console.error(error);
		console.error(`Automated .npmrc backup restore failed. You'll need to restore it manually [file at ${npmRcBackupPath}]`);
	}
});

test.serial('running CLI with the import function should create the appropriate .npmrc in the home dir', t => {
	const {stdout, stderr} = execa.commandSync('local-npm-config -i test/integration.test.sample.json --verbose');
	t.log(`stdout: ${stdout}, stderr: ${stderr}`);
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

const {test, before, teardown} = require('tap');
const {spawnSync} = require('child_process');
const {copyFile, readFile, rm} = require('fs/promises');
const {join, resolve} = require('path');
const {homedir} = require('os');

const home = homedir();

const npmRcPath = join(home, '.npmrc');
const npmRcBackupPath = join(home, '.npmrc.backup');
const rootProjectDirPath = resolve(__dirname, '..');

let backedUpExistingNpmrc = false;

// eslint-disable-next-line func-names
before(async function setup() {
	try {
		// If backup creation fails, ignore silently
		await copyFile(npmRcPath, npmRcBackupPath);

		backedUpExistingNpmrc = true;

		// Removes the existing .npmrc to prevent issues with "old" keys remaining in the file.
		await rm(npmRcPath);
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.log(`File ${npmRcPath} does not exist?`);
		} else {
			console.log(error);
			console.log(await readFile(npmRcBackupPath, 'utf-8'));
		}
	}
});

// eslint-disable-next-line func-names
teardown(async function restoreBackup() {
	if (backedUpExistingNpmrc) {
		console.log('Restoring .npmrc backup');
		try {
			await copyFile(npmRcBackupPath, npmRcPath);
		} catch (error) {
			console.log(error);
			console.log(`Automated .npmrc backup restore failed. You'll need to restore it manually [file at ${npmRcBackupPath}]`);
		}
	}
});

test('running CLI with the import function should create the appropriate .npmrc in the home dir', async t => {
	const script = join(rootProjectDirPath, 'src', 'cli.js');
	const command = `node ${script} -i test/integration.test.sample.json --verbose`;
	console.log(`Will launch the following command: ${command}`);

	spawnSync('node',
		[script, '-i', 'test/integration.test.sample.json', '--verbose'],
		{stdio: 'inherit'});

	let npmRcContent = await readFile(npmRcPath, {encoding: 'utf-8'});
	// Fix for tests running on windows
	npmRcContent = npmRcContent.replace(/\r\n/g, '\n');
	console.log(npmRcContent);
	t.equal(npmRcContent, `init-author-name=integration tester
init-author-email=integration-tester@example.org
init-author-url=https://integration-tester.org
init-license=MIT
init-version=1.0.0
`);
});

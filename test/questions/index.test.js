const {test} = require('tap');
const questions = require('../../src/questions');

test('questions should include all prompts', async t => {
	/*
	 * 1. Email
	 * 2. Name
	 * 3. Url
	 * 4. License
	 * 5. Version
	 */
	const promptsCount = 5;
	t.equal(questions.length, promptsCount);
});

import test from 'ava';

const mock = require('mock-require');

mock('inquirer', {
	registerPrompt: () => {},
	prompt: questions => questions
});

const prompt = require('../src/prompt');

test('prompt should be an async function', async t => {
	const questions = [{
		type: 'input',
		name: 'test'
	}];
	const answers = await prompt(questions);
	t.is(answers, questions);
	mock.stop('inquirer');
});

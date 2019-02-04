import test from 'ava';

const {choices} = require('../../src/questions/version');

test('choices should return all version choices names + "Leave unset"', t => {
	const choiceNames = choices.map(choice => choice.name);
	t.true(choiceNames.includes('Leave unset...'));
	t.true(choiceNames.includes('1.0.0'));
	t.true(choiceNames.includes('0.1.0'));
	t.true(choiceNames.includes('0.0.1'));
	t.true(choiceNames.includes('0.0.0'));
});

test('choices should return all version choices values + empty value for "Leave unset..."', t => {
	const choiceValues = choices.map(choice => choice.value);
	t.true(choiceValues.includes(''));
	t.true(choiceValues.includes('1.0.0'));
	t.true(choiceValues.includes('0.1.0'));
	t.true(choiceValues.includes('0.0.1'));
	t.true(choiceValues.includes('0.0.0'));
});


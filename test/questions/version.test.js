const {test} = require('tap');
const {choices} = require('../../src/questions/version');

test('choices should return all version choices names + "Leave unset"', async t => {
	const choiceNames = choices.map(choice => choice.name);
	t.ok(choiceNames.includes('Leave unset...'));
	t.ok(choiceNames.includes('1.0.0'));
	t.ok(choiceNames.includes('0.1.0'));
	t.ok(choiceNames.includes('0.0.1'));
	t.ok(choiceNames.includes('0.0.0'));
});

test('choices should return all version choices values + empty value for "Leave unset..."', async t => {
	const choiceValues = choices.map(choice => choice.value);
	t.ok(choiceValues.includes(''));
	t.ok(choiceValues.includes('1.0.0'));
	t.ok(choiceValues.includes('0.1.0'));
	t.ok(choiceValues.includes('0.0.1'));
	t.ok(choiceValues.includes('0.0.0'));
});


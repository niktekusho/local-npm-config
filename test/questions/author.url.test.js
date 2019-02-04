import test from 'ava';

const {validate} = require('../../src/questions/author.url');

test('author url prompt validation should succeed when URL is parse-able', t => {
	t.true(validate('https://github.com'));
});

test('author url prompt validation should succeed when URL is not specified', t => {
	t.true(validate(''));
	t.true(validate());
	t.true(validate(null));
});

test('author url prompt validation should return a message when URL is not parse-able', t => {
	const url = 'a//github.com';
	t.is(validate(url), `${url} is not a valid Url.`);
});

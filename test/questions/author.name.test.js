const {test} = require('tap');
const {userInfo} = require('os');

const authorName = require('../../src/questions/author.name');

test('author name default should be current user\'s username', async t => {
	t.equal(authorName.default, userInfo().username);
});

const {userInfo} = require('os');

const defaultName = userInfo().username || '';

module.exports = {
	type: 'input',
	name: 'author.name',
	message: 'What is the name you want to set in the npm config?',
	default: defaultName
};

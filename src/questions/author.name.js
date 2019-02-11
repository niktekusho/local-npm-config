const {userInfo} = require('os');

module.exports = {
	type: 'input',
	name: 'author.name',
	message: 'What is the name you want to set in the npm config?',
	default: userInfo().username
};

class ConfigExample {
	constructor(name, email, url, license, version) {
		this.author = {
			name,
			email,
			url
		};
		this.license = license;
		this.version = version;
	}
}

module.exports = {
	ConfigExample
};

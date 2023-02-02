
/**
 * Configuration type.
 */
class Configuration {
	/**
	 * Create a configuration keypair.
	 * @param {string} key Configuration key.
	 * @param {string} value Configuration value.
	 */
	constructor(key, value) {
		this.key = key.replace('.', '-');
		this.value = value;
	}

	/**
	 * Create an `init-` configuration keypair.
	 * @param {string} key Configuration key. Will be prefixed with `init-`.
	 * @param {string} val Configuration value.
	 * @returns {Configuration}.
	 */
	static initConfig(key, val) {
		return new Configuration(`init-${key}`, val);
	}
}

module.exports = Configuration;

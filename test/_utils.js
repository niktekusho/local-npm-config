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

function noop() {}

class Log {
	constructor(logger) {
		// If a parent logger is not specified (example t.log from ava) then use a noop function
		this._logger = logger || noop;
		this._rows = [];
	}

	_handleLog(type, args) {
		this._rows.push({type, args});
		this._logger(args);
	}

	debug(...args) {
		this._handleLog('debug', args);
	}

	info(...args) {
		this._handleLog('info', args);
	}

	warn(...args) {
		this._handleLog('warn', args);
	}

	error(...args) {
		this._handleLog('error', args);
	}

	/**
	 * All log rows
	 */
	get logs() {
		return this._rows;
	}

	/**
	 * Log rows of type "info"
	 */
	get infos() {
		return this.logs.filter(({type}) => type === 'info');
	}
}

class FSOperation {
	constructor(path, data) {
		this._path = path;
		this._data = data;
	}

	get path() {
		return this._path;
	}

	get data() {
		return this._data;
	}
}

module.exports = {
	ConfigExample,
	FSOperation,
	Log
};

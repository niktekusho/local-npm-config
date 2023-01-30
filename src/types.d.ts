/**
 * Logger interface.
 */
export type Logger = {
    /**
     * Log message for debugging purposes.
     * @param msg Message to log.
     */
    debug(msg: string): void,
    /**
     * Log message that might be useful to the user (no debug info).
     * @param msg Message to log.
     */
    info(msg: string): void,
    /**
     * Log message that alerts the user?
     * @param msg Message to log.
     */
    warn(msg: string): void,
    /**
     * Log message that alerts the user something went wrong.
     * @param msg Message to log.
     */
    error(msg: string): void
};

/**
 * Configuration type.
 */
export type Configuration = {
	/**
	 * Key of the configuration.
	 */
	config: string,
	/**
	 * Value of the configuration.
	 */
	value: string,
}


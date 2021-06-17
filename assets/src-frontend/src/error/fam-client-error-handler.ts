class FAMClientError extends Error {
	constructor(msg: string) {
		super(msg);

		// Set the prototype explicitly.
		Object.setPrototypeOf(this, FAMClientError.prototype);
	}

	public getError(): string {
		return this.message;
	}
}

export { FAMClientError };

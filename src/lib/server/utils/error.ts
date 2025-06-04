export class DecryptError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'DecryptError';
	}
}

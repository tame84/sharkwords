import argon2 from 'argon2';
import crypto from 'crypto';
import { PASSWORD_SECRET_KEY } from '$env/static/private';
import { DecryptError } from './error';

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12;

export const deriveKey = async (masterPassword: string, salt: string): Promise<Buffer> => {
	if (!PASSWORD_SECRET_KEY) throw new Error('PASSWORD_SECRET_KEY is not defined');

	const combined = crypto
		.createHmac('sha256', PASSWORD_SECRET_KEY)
		.update(masterPassword)
		.digest('hex');

	return await argon2.hash(combined, {
		salt: Buffer.from(salt, 'hex'),
		type: argon2.argon2id,
		hashLength: 32,
		raw: true
	});
};

export const encryptWithKey = (text: string, key: Buffer): string => {
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv(ALGO, key, iv);
	const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
	const tag = cipher.getAuthTag();

	return [iv.toString('hex'), tag.toString('hex'), encrypted.toString('hex')].join(':');
};

export const decryptWithKey = (data: string, key: Buffer): string => {
	try {
		const [ivHex, tagHex, encryptedHex] = data.split(':');
		const iv = Buffer.from(ivHex, 'hex');
		const tag = Buffer.from(tagHex, 'hex');
		const encrypted = Buffer.from(encryptedHex, 'hex');
		const decipher = crypto.createDecipheriv(ALGO, key, iv);
		decipher.setAuthTag(tag);
		const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
		return decrypted.toString('utf-8');
	} catch {
		throw new DecryptError('Wrong master password');
	}
};

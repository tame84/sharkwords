import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { user } from '../schemas/auth';

export const addSalt = async (uuid: string): Promise<void> => {
	const encryptionSalt = crypto.randomBytes(16).toString('hex');

	await db.update(user).set({ encryptionSalt }).where(eq(user.id, uuid));
};

export const getSalt = async (uuid: string): Promise<string> => {
	const result = await db
		.select({
			encryptionSalt: user.encryptionSalt
		})
		.from(user)
		.where(eq(user.id, uuid));

	const { encryptionSalt } = result[0];

	if (!encryptionSalt) {
		throw new Error("Encryption salt doesn't exist");
	}

	return encryptionSalt;
};

import { and, eq } from 'drizzle-orm';
import { db } from '../index';
import { password } from '../schemas/app';
import { getSalt } from './user';
import { decryptWithKey, deriveKey } from '$lib/server/utils/password';

export const addPassword = async (
	uuid: string,
	website: string,
	label: string,
	userPassword: string
): Promise<void> => {
	await db.insert(password).values({
		website,
		label,
		password: userPassword,
		userId: uuid
	});
};

export const getPasswords = async (
	uuid: string
): Promise<{ id: string; website: string; label: string | null }[]> => {
	const result = await db
		.select({
			id: password.id,
			website: password.website,
			label: password.label
		})
		.from(password)
		.where(eq(password.userId, uuid));

	return result.sort((a, b) => {
		const siteCompare = a.website.localeCompare(b.website);
		if (siteCompare !== 0) return siteCompare;

		if (a.label === null && b.label === null) return 0;
		if (a.label === null) return 1;
		if (b.label === null) return -1;
		return a.label.localeCompare(b.label);
	});
};

export const getPassword = async (
	uuid: string,
	id: string,
	masterPassword: string
): Promise<string> => {
	const result = await db
		.select({
			userPassword: password.password
		})
		.from(password)
		.where(and(eq(password.userId, uuid), eq(password.id, id)));

	let { userPassword } = result[0];

	if (!userPassword) {
		throw new Error("Password doesn't exist");
	}

	const encryptionSalt = await getSalt(uuid);
	const key = await deriveKey(masterPassword, encryptionSalt);

	userPassword = decryptWithKey(userPassword, key);

	return userPassword;
};

export const editPassword = async (
	uuid: string,
	id: string,
	userPassword: string
): Promise<void> => {
	await db
		.update(password)
		.set({ password: userPassword })
		.where(and(eq(password.userId, uuid), eq(password.id, id)));
};

export const deletePassword = async (uuid: string, id: string): Promise<void> => {
	await db.delete(password).where(and(eq(password.userId, uuid), eq(password.id, id)));
};

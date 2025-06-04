import { auth } from '$lib/server/auth';
import { getSalt } from '$lib/server/db/utils/user';
import { deriveKey, encryptWithKey } from '$lib/server/utils/password';
import { addPassword } from '$lib/server/db/utils/password';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { website, label, password, masterPassword, masterPasswordConfirm } = await request.json();

	if (!website || !password || !masterPassword || !masterPasswordConfirm) {
		return json({
			status: 400,
			error: true,
			message: 'Website, password, master password and confirm master password fields are required'
		});
	}
	if (masterPassword !== masterPasswordConfirm) {
		return json({ status: 400, error: true, message: "Master passwords don't match" });
	}

	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user.id) {
			return json({ status: 500, error: true, message: 'Unexpected error' });
		}

		const encryptionSalt = await getSalt(session?.user.id);
		const key = await deriveKey(masterPassword, encryptionSalt);
		const encryptedPassword = encryptWithKey(password, key);

		await addPassword(session?.user.id, website, label, encryptedPassword);

		return json({ status: 201, data: { message: 'Password has been created' } });
	} catch (error) {
		console.error('Unexpected error while adding password :', error);
		return json({ status: 500, error: true, message: 'Unexpected error' });
	}
};

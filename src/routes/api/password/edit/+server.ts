import { auth } from '$lib/server/auth';
import { getSalt } from '$lib/server/db/utils/user';
import { deriveKey, encryptWithKey } from '$lib/server/utils/password';
import { editPassword } from '$lib/server/db/utils/password';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { passwordId, password, masterPassword } = await request.json();

	if (!passwordId || !password || !masterPassword) {
		return json({
			status: 400,
			error: true,
			message: 'All fields are required'
		});
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

		await editPassword(session?.user.id, passwordId, encryptedPassword);

		return json({ status: 201, data: { message: 'Password has been edited' } });
	} catch (error) {
		console.error('Unexpected error while adding password :', error);
		return json({ status: 500, error: true, message: 'Unexpected error' });
	}
};

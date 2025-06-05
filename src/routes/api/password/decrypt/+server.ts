import { auth } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import { getPassword } from '$lib/server/db/utils/password';
import { DecryptError } from '$lib/server/utils/error.js';

export const POST = async ({ request }) => {
	const { masterPassword, passwordId } = await request.json();

	if (!masterPassword || !passwordId) {
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

		const password = await getPassword(session.user.id, passwordId, masterPassword);
		return json({ status: 200, data: { password } });
	} catch (error) {
		if (error instanceof DecryptError) {
			return json({ status: 500, error: true, message: error.message });
		}
		console.error('Unexpected error while adding password :', error);
		return json({ status: 500, error: true, message: 'Unexpected error' });
	}
};

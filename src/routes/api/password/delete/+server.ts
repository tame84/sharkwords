import { auth } from '$lib/server/auth';
import { deletePassword } from '$lib/server/db/utils/password';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { passwordId } = await request.json();

	if (!passwordId) {
		return json({
			status: 400,
			error: true,
			message: 'Password ID is required'
		});
	}

	try {
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user.id) {
			return json({ status: 500, error: true, message: 'Unexpected error' });
		}

		await deletePassword(session?.user.id, passwordId);

		return json({ status: 204, data: { message: 'Password has been edited' } });
	} catch (error) {
		console.error('Unexpected error while adding password :', error);
		return json({ status: 500, error: true, message: 'Unexpected error' });
	}
};

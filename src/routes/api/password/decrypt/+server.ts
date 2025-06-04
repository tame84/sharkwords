import { auth } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import { getPassword } from '$lib/server/db/utils/password';

export const POST = async ({ request }) => {
	const { masterPassword, passwordId } = await request.json();

	if (!masterPassword || !passwordId) {
		return json(
			{
				error: true,
				message: 'All fields are required'
			},
			{
				status: 400
			}
		);
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
		console.error('Unexpected error while adding password :', error);
		return json({ status: 500, error: true, message: 'Unexpected error' });
	}
};

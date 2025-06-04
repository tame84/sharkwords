import { auth } from '$lib/server/auth';
import { getPasswords } from '$lib/server/db/utils/password';

export const load = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user.id) {
		return;
	}

	try {
		const passwords = await getPasswords(session.user.id);

		return {
			passwords
		};
	} catch (error) {
		console.error('Unexpected error while fetchign passwords :', error);
	}
};

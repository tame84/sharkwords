import { auth } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';

export const POST = async ({ request }) => {
	try {
		await auth.api.signOut({
			headers: request.headers
		});

		return json({
			status: 200,
			data: { redirectUrl: '/auth/sign-in' }
		});
	} catch (error) {
		if (error instanceof APIError) {
			console.error(error.body?.error);
			return json({
				status: 500,
				error: true,
				message: 'Unexpected error during sign out'
			});
		}
		console.error(error);
		return json({
			status: 500,
			error: true,
			message: 'Unexpected error during sign out'
		});
	}
};

import { auth } from '$lib/server/auth.js';
import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: true, message: 'All fields are required' });
		}

		try {
			await auth.api.signInEmail({
				body: {
					email,
					password
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return fail(500, { error: true, message: error.body?.message });
			}
			console.error('Unexpected error during sign in :', error);
			return fail(500, { error: true, message: 'Unexpected error' });
		}

		return redirect(303, '/');
	}
};

import { auth } from '$lib/server/auth';
import { addSalt } from '$lib/server/db/utils/user';
import { fail, redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const username = data.get('username') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const passwordConfirm = data.get('passwordConfirm') as string;

		if (!username || !email || !password || !passwordConfirm) {
			return fail(400, { error: true, message: 'All fields are required' });
		}
		if (password !== passwordConfirm) {
			return fail(400, { error: true, message: "Passwords don't match" });
		}

		try {
			const session = await auth.api.signUpEmail({
				body: {
					email,
					password,
					name: username
				}
			});

			await addSalt(session.user.id);
		} catch (error) {
			if (error instanceof APIError) {
				return fail(500, { error: true, message: error.body?.message });
			}
			console.error('Unexpected error during sign up :', error);
			return fail(500, { error: true, message: 'Unexpected error' });
		}

		return redirect(303, '/');
	}
};

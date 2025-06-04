import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle = async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth });
};

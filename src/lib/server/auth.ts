import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { svelteCookies } from './auth-svelte-cookies';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	plugins: [svelteCookies()],
	emailAndPassword: {
		enabled: true
	}
});

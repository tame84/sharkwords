import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const password = pgTable('passwords', {
	id: uuid('id').defaultRandom().primaryKey(),
	website: text('website').notNull(),
	label: text('label'),
	password: text('password').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

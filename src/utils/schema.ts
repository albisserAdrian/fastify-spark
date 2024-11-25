import { pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const apiKeyTable = pgTable('api_keys', {
  id: text().$defaultFn(() => createId()),
  description: varchar({ length: 255 }).notNull(),
  key: varchar({ length: 255 }).notNull().unique(),
  hint: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow().notNull(),
  expires_at: timestamp().notNull(),
});

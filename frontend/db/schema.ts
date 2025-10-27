import {varchar, serial, integer, pgTable} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  externalId: varchar('external_id').notNull().unique(),
  page: integer('page'),
})

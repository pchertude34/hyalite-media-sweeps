import {varchar, serial, integer, pgTable, primaryKey} from 'drizzle-orm/pg-core'

export const usersTable = pgTable(
  'users',
  {
    clientId: varchar('client_id').notNull(),
    externalId: varchar('external_id').notNull(),
    page: integer('page'),
  },
  (table) => {
    return {
      pk: primaryKey({columns: [table.clientId, table.externalId], name: 'client_user_pkey'}),
    }
  },
)

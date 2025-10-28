import {varchar, serial, integer, pgTable, primaryKey, timestamp} from 'drizzle-orm/pg-core'

export const usersTable = pgTable(
  'users',
  {
    clientId: varchar('client_id').notNull(),
    externalId: varchar('external_id').notNull(),
    questionIndex: integer('question_index'),
  },
  (table) => {
    return [primaryKey({columns: [table.clientId, table.externalId], name: 'client_user_pkey'})]
  },
)

export const questionAnalyticsTable = pgTable('question_analytics', {
  id: serial('id').primaryKey(),
  externalId: varchar('external_id').notNull(),
  questionIndex: integer('question_index').notNull(),
  clientId: varchar('client_id').notNull(),
  questionId: varchar('question_id').notNull(),
  questionText: varchar('question_text').notNull(),
  answerText: varchar('answer_text').notNull(),
  answerStatus: varchar('answer_status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

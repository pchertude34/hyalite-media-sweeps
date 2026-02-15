'use server'

import {draftMode} from 'next/headers'
import {db} from '@/db'
import {questionAnalyticsTable, questionImpressionsTable, usersTable} from '@/db/schema'
import {eq} from 'drizzle-orm'

export async function disableDraftMode() {
  'use server'
  await Promise.allSettled([
    (await draftMode()).disable(),
    // Simulate a delay to show the loading state
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ])
}

export async function updateUserPage(formData: FormData) {
  const externalId = formData.get('externalId') as string
  const questionIndex = formData.get('questionIndex') as string

  if (!externalId) return

  await db
    .update(usersTable)
    .set({questionIndex: Number(questionIndex)})
    .where(eq(usersTable.externalId, externalId))
}

export async function trackQuestionResponse(formData: FormData) {
  const externalId = formData.get('externalId') as string
  const questionIndex = formData.get('questionIndex') as string
  const clientId = formData.get('clientId') as string
  const questionId = formData.get('questionId') as string
  const questionText = formData.get('questionText') as string
  const answerText = formData.get('answerText') as string
  const answerStatus = formData.get('answerStatus') as string

  if (!externalId) return

  console.log('inserting in db')

  await db.insert(questionAnalyticsTable).values({
    externalId,
    questionIndex: Number(questionIndex),
    clientId,
    questionId,
    questionText,
    answerText,
    answerStatus,
  })
}

export async function trackQuestionImpression(formData: FormData) {
  const externalId = formData.get('externalId') as string
  const questionIndex = formData.get('questionIndex') as string
  const clientId = formData.get('clientId') as string
  const questionId = formData.get('questionId') as string
  const questionText = formData.get('questionText') as string

  await db.insert(questionImpressionsTable).values({
    externalId,
    questionIndex: Number(questionIndex),
    clientId,
    questionId,
    questionText,
  })
}

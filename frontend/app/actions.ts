'use server'

import {draftMode} from 'next/headers'
import {db} from '@/db'
import {usersTable} from '@/db/schema'
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
  const page = formData.get('page') as string

  await db
    .update(usersTable)
    .set({page: Number(page)})
    .where(eq(usersTable.externalId, externalId))
}

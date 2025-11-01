import {clientQuery} from '@/sanity/lib/queries'
import {client} from '@/sanity/lib/client'
import {Client} from '@/sanity.types'
import {QuestionCard} from '../components/QuestionCard'
import {db} from '@/db'
import {usersTable} from '@/db/schema'
import {eq, InferSelectModel, and} from 'drizzle-orm'
import {notFound} from 'next/navigation'
import {trackQuestionResponse, updateUserPage} from '../actions'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{clientSlug: string}>
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}) {
  const {clientSlug} = await params
  const {id, ...templateValues} = await searchParams

  let user: InferSelectModel<typeof usersTable> | undefined

  // Create or find the user based on the query param 'id'
  if (id) {
    user = await db.query.users.findFirst({
      where: and(eq(usersTable.externalId, id as string), eq(usersTable.clientId, clientSlug)),
    })

    if (!user) {
      ;[user] = await db
        .insert(usersTable)
        .values({
          clientId: clientSlug,
          externalId: id as string,
          questionIndex: 0,
        })
        .returning()
    }
  }

  const data = await client.fetch(clientQuery, {
    clientSlug,
  })

  if (!data || !data?.leadingQuestion || !data.surveyQuestions) {
    notFound()
  }

  return (
    <QuestionCard
      clientData={data as Client}
      user={user}
      templateValues={templateValues as Record<string, string | undefined>}
    />
  )
}

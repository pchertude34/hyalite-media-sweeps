import {clientQuestionQuery} from '@/sanity/lib/queries'
import {client} from '@/sanity/lib/client'
import {ClientQuestionQueryResult, Question} from '@/sanity.types'
import QuestionResponseButtons from '../components/QuestionResponseButtons'
import {QuestionCard} from '../components/QuestionCard'
import {db} from '@/db'
import {usersTable} from '@/db/schema'
import {eq, InferSelectModel, and} from 'drizzle-orm'
import {updateUserPage} from '../actions'

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{clientSlug: string}>
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}) {
  const {clientSlug} = await params
  const {id} = await searchParams

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
          page: 0,
        })
        .returning()
    }
  }

  const data = await client.fetch(clientQuestionQuery, {
    clientSlug,
  })

  if (!data?.leadingQuestion || !data.surveyQuestions) {
    return <div className="text-gray-600">Question not found</div>
  }

  return (
    <QuestionCard
      leadingQuestion={data.leadingQuestion}
      surveyQuestions={data.surveyQuestions}
      user={user}
      onSurveyQuestionAnswered={updateUserPage}
    />
  )
}

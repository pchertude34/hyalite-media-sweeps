import {clientQuery, clientSlugsQuery} from '@/sanity/lib/queries'
import {draftMode} from 'next/headers'
import {Client} from '@/sanity.types'
import {QuestionCard} from '../components/QuestionCard'
import {db} from '@/db'
import {usersTable} from '@/db/schema'
import {eq, InferSelectModel, and} from 'drizzle-orm'
import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: clientSlugsQuery,
    perspective: 'published',
    stega: false,
  })

  return data
}

export async function generateMetadata(): Promise<Metadata> {
  // const {clientSlug} = props.params

  // use this query to get dynamic metadata if needed
  // const {data} = await sanityFetch({
  //   query: clientMetadataQuery,
  //   params: {clientSlug},
  //   stega: false,
  // })

  return {
    title: 'Sweepstakes Available!',
  } satisfies Metadata
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{clientSlug: string}>
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}) {
  const {clientSlug} = await params
  const {id, ...templateValues} = await searchParams
  const {isEnabled: isDraftMode} = await draftMode()

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

  const {data} = await sanityFetch({
    query: clientQuery,
    params: {clientSlug},
    stega: false,
  })

  if (!data || !data?.leadingQuestion || !data.surveyQuestions) {
    notFound()
  }

  return (
    <QuestionCard
      clientData={data as Client}
      user={user}
      templateValues={templateValues as Record<string, string | undefined>}
      draftMode={isDraftMode}
    />
  )
}

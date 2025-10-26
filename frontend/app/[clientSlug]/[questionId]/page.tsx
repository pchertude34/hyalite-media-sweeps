import {clientQuestionQuery} from '@/sanity/lib/queries'
import {client} from '@/sanity/lib/client'
import {ClientQuestionQueryResult, Question} from '@/sanity.types'

export default async function Page({
  params,
}: {
  params: Promise<{clientSlug: string; questionId: string}>
}) {
  const {clientSlug, questionId} = await params

  console.log('clientSlug', clientSlug)
  const data = await client.fetch(clientQuestionQuery, {
    clientSlug,
    index: parseInt(questionId, 10),
  })

  console.log('data', data)

  return <div>Hello world: {data?.surveyQuestions?.[0].questionText}</div>
}

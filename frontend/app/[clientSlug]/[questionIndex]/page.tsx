import {clientQuestionQuery} from '@/sanity/lib/queries'
import {client} from '@/sanity/lib/client'
import {ClientQuestionQueryResult, Question} from '@/sanity.types'
import QuestionResponseButtons from './components/QuestionResponseButtons'
import clsx from 'clsx'

export default async function Page({
  params,
}: {
  params: Promise<{clientSlug: string; questionIndex: string}>
}) {
  const {clientSlug, questionIndex} = await params

  console.log('clientSlug', clientSlug)
  const data = await client.fetch(clientQuestionQuery, {
    clientSlug,
  })

  console.log('data', data)

  const question: Question | undefined = data?.surveyQuestions?.[parseInt(questionIndex, 10)]

  if (!question) {
    return <div className="text-gray-600">Question not found</div>
  }

  return (
    // Outer wrapper: full width/height so the parent iframe can size it.
    // Use transparent background in embed mode so parent controls visuals.
    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-transparent">
      <article className="w-full h-full p-4 rounded-lg shadow-sm">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 text-center">
            {question.questionText}
          </h2>
          {(question as any).description && (
            <p className="mt-2 text-sm text-gray-500">{(question as any).description}</p>
          )}
        </header>

        <QuestionResponseButtons options={(question as any).responseOptions ?? []} />
      </article>
    </div>
  )
}

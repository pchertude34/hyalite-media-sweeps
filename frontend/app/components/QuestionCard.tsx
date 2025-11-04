'use client'
import React, {useState} from 'react'
import QuestionResponseButtons from './QuestionResponseButtons'
import {Client, Question} from '@/sanity.types'
import {InferSelectModel} from 'drizzle-orm'
import {PortableText} from '@portabletext/react'
import {usersTable} from '@/db/schema'
import {trackQuestionResponse, updateUserPage} from '../actions'
import {
  renderTemplate,
  convertBlocksToPlainText,
  renderTemplateInBlockContent,
} from '../client-utils'

type QuestionCardProps = {
  clientData: Client
  user?: InferSelectModel<typeof usersTable>
  templateValues?: Record<string, string | undefined>
  draftMode?: boolean
}

export function QuestionCard(props: QuestionCardProps) {
  const {
    clientData: {leadingQuestion, surveyQuestions, headline, thankYouMessage, maxAnswers},
    user,
    templateValues,
    draftMode = false,
  } = props

  const [hasAnsweredLeadingQuestion, setHasAnsweredLeadingQuestion] = useState(false)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(
    user?.questionIndex && user?.questionIndex < surveyQuestions.length ? user?.questionIndex : 0,
  )

  function handleLeadingQuestionAnswered(answer: NonNullable<Question['answers']>[number]) {
    setHasAnsweredLeadingQuestion(true)
  }

  function handleSurveyQuestionAnswered(answer: NonNullable<Question['answers']>[number]) {
    // wrap around to the first question if at the end
    setQuestionIndex((prevIndex) => {
      if (prevIndex >= surveyQuestions.length && !draftMode) {
        return 0
      }
      return prevIndex + 1
    })

    setQuestionsAnswered((prev) => prev + 1)

    if (answer.answerUrl) {
      window.open(answer.answerUrl, '_blank', 'noopener,noreferrer')
    }

    if (user) {
      const formData = new FormData()
      formData.append('externalId', user.externalId)
      formData.append('questionIndex', String(questionIndex + 1))
      formData.append('clientId', user.clientId)
      formData.append('questionId', surveyQuestions[questionIndex]._key)
      formData.append(
        'questionText',
        convertBlocksToPlainText(surveyQuestions[questionIndex].questionText),
      )
      formData.append('answerText', answer.answerText)
      formData.append('answerStatus', answer.answerType)
      updateUserPage(formData)
      trackQuestionResponse(formData)
    }
  }

  // Show questions until the user answers as many questions as allowed, or they reached the end of all of the questions

  const showThankYouMessage = draftMode
    ? questionIndex >= surveyQuestions.length
    : (maxAnswers && questionsAnswered >= maxAnswers) || questionIndex >= surveyQuestions.length

  const showQuestions = hasAnsweredLeadingQuestion && !showThankYouMessage

  return (
    <div className="w-full h-full min-h-screen flex justify-center bg-white p-4">
      <article className="flex flex-col w-full max-w-4xl min-h-64 items-center">
        <div className="my-auto h-full w-full">
          {headline && (
            <h2 className="text-2xl md:text-3xl mb-10 text-center font-bold">
              {renderTemplate(headline, {...templateValues})}
            </h2>
          )}
          {!hasAnsweredLeadingQuestion && (
            <>
              <div className="prose mx-auto text-center mb-4">
                <PortableText
                  components={{
                    block: {
                      normal: ({children}) => <p className="text-lg md:text-xl">{children}</p>,
                    },
                  }}
                  value={renderTemplateInBlockContent(leadingQuestion.questionText, {
                    ...templateValues,
                  })}
                />
              </div>
              <QuestionResponseButtons
                answers={leadingQuestion.answers}
                onAnswer={handleLeadingQuestionAnswered}
              />
            </>
          )}
          {showQuestions && (
            <>
              <div className="prose mx-auto text-center mb-4">
                <PortableText
                  components={{
                    block: {
                      normal: ({children}) => <p className="text-lg md:text-xl">{children}</p>,
                    },
                  }}
                  value={surveyQuestions[questionIndex].questionText}
                />
              </div>
              <QuestionResponseButtons
                answers={surveyQuestions[questionIndex].answers}
                onAnswer={handleSurveyQuestionAnswered}
              />
            </>
          )}
          {showThankYouMessage && (
            <p className="text-lg md:text-xl text-center">{thankYouMessage}</p>
          )}
        </div>
      </article>
    </div>
  )
}

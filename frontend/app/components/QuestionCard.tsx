'use client'
import React, {useState} from 'react'
import QuestionResponseButtons from './QuestionResponseButtons'
import {Client, Question} from '@/sanity.types'
import {InferSelectModel} from 'drizzle-orm'
import {usersTable} from '@/db/schema'
import {trackQuestionResponse, updateUserPage} from '../actions'

type QuestionCardProps = {
  clientData: Client
  user?: InferSelectModel<typeof usersTable>
}

export function QuestionCard(props: QuestionCardProps) {
  const {
    clientData: {leadingQuestion, surveyQuestions, headline, thankYouMessage, maxAnswers},
    user,
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
      if (prevIndex + 1 >= surveyQuestions.length) {
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
      formData.append('questionText', surveyQuestions[questionIndex].questionText)
      formData.append('answerText', answer.answerText)
      formData.append('answerStatus', answer.answerType)
      updateUserPage(formData)
      trackQuestionResponse(formData)
    }
  }

  // Show questions until the user answers as many questions as allowed, or they reached the end of all of the questions
  const showQuestions =
    hasAnsweredLeadingQuestion &&
    maxAnswers &&
    questionsAnswered < maxAnswers &&
    questionIndex < surveyQuestions.length

  const showThankYouMessage =
    hasAnsweredLeadingQuestion &&
    ((maxAnswers && questionsAnswered >= maxAnswers) || questionIndex >= surveyQuestions.length)

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-800 p-4">
      <article className="flex flex-col w-full max-w-4xl min-h-64 p-6 md:p-10 rounded-lg shadow-sm bg-white items-center">
        <div className="my-auto h-full w-full">
          <h2 className="text-2xl md:text-3xl mb-10 text-center font-semibold underline">
            {headline}
          </h2>
          {!hasAnsweredLeadingQuestion && (
            <>
              <p className="text-lg md:text-xl mb-10 text-center">{leadingQuestion.questionText}</p>
              <QuestionResponseButtons
                answers={leadingQuestion.answers}
                onAnswer={handleLeadingQuestionAnswered}
              />
            </>
          )}
          {showQuestions && (
            <>
              <p className="text-lg md:text-xl text-center mb-10">
                {surveyQuestions[questionIndex].questionText}
              </p>
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

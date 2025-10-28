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
    clientData: {leadingQuestion, surveyQuestions},
    user,
  } = props

  const [hasAnsweredLeadingQuestion, setHasAnsweredLeadingQuestion] = useState(false)
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

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-800 p-4">
      <article className="flex flex-col w-full max-w-4xl min-h-64 p-6 rounded-lg shadow-sm bg-white items-center">
        <div className="my-auto h-full w-full">
          {!hasAnsweredLeadingQuestion ? (
            <>
              <h2 className="text-2xl font-semibold mb-10 text-center">
                {leadingQuestion.questionText}
              </h2>
              <QuestionResponseButtons
                answers={leadingQuestion.answers}
                onAnswer={handleLeadingQuestionAnswered}
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center mb-10">
                {surveyQuestions[questionIndex].questionText}
              </h2>
              <QuestionResponseButtons
                answers={surveyQuestions[questionIndex].answers}
                onAnswer={handleSurveyQuestionAnswered}
              />
            </>
          )}
        </div>
      </article>
    </div>
  )
}
